import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { getGrassSpeciesForZipcode } from './lib/grassSpeciesMatching';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import { setupPlanRoutes } from './lib/setupPlanRoutes';

// Define types
type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

type Auth = {
  username: string;
  password: string;
};

// Ensure TOKEN_SECRET is set in environment variables
const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

// Set up database connection
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Set up static file serving
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
app.use(express.static(uploadsStaticDir));
app.use(express.json());

/**
 * User sign-up endpoint
 */
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body as Auth;
    validateUser({ username, password });
    const hashedPassword = await argon2.hash(password);
    const sql = `
      INSERT INTO "Users" (username, "hashedPassword")
      VALUES ($1, $2)
      RETURNING "userId"
    `;
    const result = await db.query<User>(sql, [username, hashedPassword]);
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * User sign-in endpoint
 */
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Auth;
    validateUser({ username, password });
    const sql = `SELECT * FROM "Users" WHERE username = $1`;
    const result = await db.query<User>(sql, [username]);
    if (result.rows.length === 0) {
      throw new ClientError(401, 'Invalid login');
    }
    const user = result.rows[0];
    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new ClientError(401, 'Invalid login');
    }
    const token = jwt.sign({ userId: user.userId }, hashKey);
    const payload = {
      userId: user.userId,
      username,
    };
    res.status(200).json({
      user: payload,
      token,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Get grass species recommendations for a zipcode
 */
app.get('/api/grass-species/:zipcode', async (req, res, next) => {
  const { zipcode } = req.params;
  try {
    const grassSpecies = await getGrassSpeciesForZipcode(db, zipcode);
    res.status(200).json(grassSpecies);
  } catch (err) {
    if (err instanceof ClientError && err.message === 'Invalid zipcode') {
      res.status(400).json({ error: 'Invalid zipcode' });
    } else {
      next(err);
    }
  }
});

/**
 * Get plan types for a specific grass species
 */
app.get(
  '/api/grass-species/:grassSpeciesId/plan-types',
  async (req, res, next) => {
    const { grassSpeciesId } = req.params;

    try {
      const query = `
        SELECT DISTINCT "planType", "establishmentType"
        FROM "PlanStepTemplates"
        WHERE "grassSpeciesId" = $1 AND "planType" != 'lawn_improvement'
      `;

      const result = await db.query(query, [grassSpeciesId]);

      const planTypes = result.rows.map((row) => ({
        planType: row.planType,
        establishmentType: row.establishmentType,
      }));

      res.json(planTypes);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Create a new plan
 */
app.post('/api/plans/new', authMiddleware, async (req, res, next) => {
  const client = await db.connect();
  try {
    const { userId, grassSpeciesId, planType, establishmentType } = req.body;

    // Validate input
    if (!userId || !grassSpeciesId || !planType) {
      throw new ClientError(400, 'Missing required fields');
    }

    if (planType === 'new_lawn' && !establishmentType) {
      throw new ClientError(
        400,
        'Establishment type is required for new lawn plans'
      );
    }

    // Start a transaction
    await client.query('BEGIN');

    // Insert the new plan
    const insertPlanSql = `
      INSERT INTO "UserPlans" ("userId", "grassSpeciesId", "planType", "establishmentType")
      VALUES ($1, $2, $3, $4)
      RETURNING "userPlanId"
    `;
    const planResult = await client.query(insertPlanSql, [
      userId,
      grassSpeciesId,
      planType,
      establishmentType,
    ]);
    const userPlanId = planResult.rows[0].userPlanId;

    // Fetch the appropriate plan step templates
    let fetchTemplatesSql;
    let templateParams;

    if (planType === 'lawn_improvement') {
      fetchTemplatesSql = `
        SELECT * FROM "PlanStepTemplates"
        WHERE "grassSpeciesId" = $1 AND "planType" = $2
        ORDER BY "stepOrder"
      `;
      templateParams = [grassSpeciesId, planType];
    } else {
      fetchTemplatesSql = `
        SELECT * FROM "PlanStepTemplates"
        WHERE "grassSpeciesId" = $1 AND "planType" = $2 AND "establishmentType" = $3
        ORDER BY "stepOrder"
      `;
      templateParams = [grassSpeciesId, planType, establishmentType];
    }

    const templatesResult = await client.query(
      fetchTemplatesSql,
      templateParams
    );

    // Insert plan steps for the new plan
    const insertStepSql = `
      INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed", "stepOrder")
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    let currentDate = new Date();
    const insertedStepDescriptions = new Set();
    for (const template of templatesResult.rows) {
      if (!insertedStepDescriptions.has(template.stepDescription)) {
        await client.query(insertStepSql, [
          userPlanId,
          template.templateId,
          template.stepDescription,
          currentDate,
          false,
          template.stepOrder,
        ]);
        insertedStepDescriptions.add(template.stepDescription);
        if (template.intervalToNextStep) {
          currentDate = new Date(
            currentDate.getTime() +
              template.intervalToNextStep.days * 24 * 60 * 60 * 1000
          );
        }
      }
    }

    // Commit the transaction
    await client.query('COMMIT');
    res.status(201).json({ userPlanId });
  } catch (err) {
    console.error('Error creating new plan:', err);
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// Set up additional plan-related routes
setupPlanRoutes(app, db);

// Catch-all route for React Router
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log('Listening on port', port);
});

/**
 * Validate user input for registration and login
 * @param user - User input to validate
 * @throws {ClientError} If validation fails
 */
function validateUser(user: Auth): void {
  const { username, password } = user;
  if (!username || username.trim() === '') {
    throw new ClientError(400, 'Username is required');
  }

  if (!password) {
    throw new ClientError(400, 'Password is required');
  }
  if (password.length < 8) {
    throw new ClientError(400, 'Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    throw new ClientError(
      400,
      'Password must contain at least one uppercase letter'
    );
  }
  if (!/\d/.test(password)) {
    throw new ClientError(400, 'Password must contain at least one number');
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg, { PoolClient } from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { getGrassSpeciesForZipcode } from './lib/grassSpeciesMatching';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';
import { setupPlanRoutes } from './lib/setupPlanRoutes';

type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};
type Auth = {
  username: string;
  password: string;
};

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    validateUser({ username, password });
    const hashedPassword = await argon2.hash(password);
    const sql = `INSERT INTO "Users" (username, "hashedPassword") VALUES ($1, $2) RETURNING "userId"`;
    const params = [username, hashedPassword];
    const result = await db.query<User>(sql, params);
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    validateUser({ username, password });
    const sql = `SELECT * FROM "Users" WHERE username = $1`;
    const params = [username];
    const result = await db.query<User>(sql, params);
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

// ... (previous imports and setup remain the same)
app.post('/api/plans/new', async (req, res, next) => {
  console.log('Received new plan request:', req.body);
  const client = await db.connect();
  try {
    const { userId, grassSpecies, planType, lawnType } = req.body;

    // Validate input
    if (!userId || !grassSpecies || !planType) {
      throw new ClientError(400, 'Missing required fields');
    }

    if (planType === 'new_lawn' && !lawnType) {
      throw new ClientError(400, 'Lawn type is required for new lawn plans');
    }

    // Start a transaction
    await client.query('BEGIN');

    // Insert the new plan
    const insertPlanSql = `
      INSERT INTO "UserPlans" ("userId", "grassSpeciesId", "planType")
      VALUES ($1, $2, $3)
      RETURNING "userPlanId"
    `;
    const planResult = await client.query(insertPlanSql, [
      userId,
      grassSpecies,
      planType,
    ]);
    const userPlanId = planResult.rows[0].userPlanId;
    console.log('Created new plan with ID:', userPlanId);

    // Fetch the appropriate plan step templates
    const fetchTemplatesSql = `
      SELECT * FROM "PlanStepTemplates"
      WHERE "grassSpeciesId" = $1 AND "planType" = $2
      ORDER BY "stepOrder"
    `;
    const templatesResult = await client.query(fetchTemplatesSql, [
      grassSpecies,
      planType,
    ]);
    console.log('Fetched', templatesResult.rows.length, 'plan step templates');

    // Insert plan steps for the new plan
    const insertStepSql = `
      INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed")
      VALUES ($1, $2, $3, $4, $5)
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
          false, // Set initial completed status to false
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
    console.log('Inserted', insertedStepDescriptions.size, 'unique plan steps');

    // Commit the transaction
    await client.query('COMMIT');
    console.log('Transaction committed successfully');

    res.status(201).json({ userPlanId });
  } catch (err) {
    console.error('Error creating new plan:', err);
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

// ... (rest of the server code remains the same)

setupPlanRoutes(app, db);
/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});

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

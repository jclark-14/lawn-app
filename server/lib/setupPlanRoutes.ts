import express from 'express';
import { Pool } from 'pg';
import { authMiddleware, ClientError } from './index';
import type { UserPlan, PlanStep } from '../../client/src/types';

export function setupPlanRoutes(app: express.Application, pool: Pool): void {
  // Fetch a specific plan
  app.get('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;

    const client = await pool.connect();
    try {
      // Fetch the plan with grass species name
      const planSql = `
        SELECT up.*, gs.name as "grassSpeciesName"
        FROM "UserPlans" up
        JOIN "GrassSpecies" gs ON up."grassSpeciesId" = gs."grassSpeciesId"
        WHERE up."userPlanId" = $1 AND up."userId" = $2
      `;
      const planResult = await client.query(planSql, [planId, userId]);

      if (planResult.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      const plan = planResult.rows[0];

      // Fetch the steps for the plan
      const stepsSql = `
        SELECT * FROM "PlanSteps"
        WHERE "userPlanId" = $1
        ORDER BY "dueDate" ASC
      `;
      const stepsResult = await client.query(stepsSql, [planId]);

      const userPlan: UserPlan = {
        ...plan,
        steps: stepsResult.rows,
      };

      res.json(userPlan);
    } catch (err) {
      next(err);
    } finally {
      client.release();
    }
  });

  app.put('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;
    const updatedPlan: UserPlan = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updatePlanSql = `
      UPDATE "UserPlans"
      SET "grassSpeciesId" = $1, "planType" = $2, "isCompleted" = $3, "isArchived" = $4
      WHERE "userPlanId" = $5 AND "userId" = $6
      RETURNING *
    `;
      const planResult = await client.query(updatePlanSql, [
        updatedPlan.grassSpeciesId,
        updatedPlan.planType,
        updatedPlan.isCompleted || false,
        updatedPlan.isArchived || false,
        planId,
        userId,
      ]);

      if (planResult.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      // Update or insert steps
      for (const step of updatedPlan.steps) {
        if (step.planStepId) {
          const updateStepSql = `
          UPDATE "PlanSteps"
          SET "stepDescription" = $1, "dueDate" = $2, "completed" = $3
          WHERE "planStepId" = $4 AND "userPlanId" = $5
        `;
          await client.query(updateStepSql, [
            step.stepDescription,
            step.dueDate,
            step.completed,
            step.planStepId,
            planId,
          ]);
        } else {
          const insertStepSql = `
          INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed")
          VALUES ($1, $2, $3, $4, $5)
        `;
          await client.query(insertStepSql, [
            planId,
            null,
            step.stepDescription,
            step.dueDate,
            step.completed,
          ]);
        }
      }

      await client.query('COMMIT');

      // Fetch the updated plan with grass species name
      const updatedPlanSql = `
      SELECT up.*, gs.name as "grassSpeciesName", ps.*
      FROM "UserPlans" up
      JOIN "GrassSpecies" gs ON up."grassSpeciesId" = gs."grassSpeciesId"
      LEFT JOIN "PlanSteps" ps ON up."userPlanId" = ps."userPlanId"
      WHERE up."userPlanId" = $1
      ORDER BY ps."dueDate" ASC
    `;
      const updatedPlanResult = await client.query(updatedPlanSql, [planId]);

      const finalPlan: UserPlan = {
        ...updatedPlanResult.rows[0],
        steps: updatedPlanResult.rows.map((row: any) => ({
          planStepId: row.planStepId,
          stepDescription: row.stepDescription,
          dueDate: row.dueDate,
          completed: row.completed,
        })),
      };

      res.json(finalPlan);
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  });

  // Delete a plan
  app.delete('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;

    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query('BEGIN');

      // Delete associated steps
      const deleteStepsSql = `
        DELETE FROM "PlanSteps"
        WHERE "userPlanId" = $1
      `;
      await client.query(deleteStepsSql, [planId]);

      // Delete the plan
      const deletePlanSql = `
        DELETE FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
        RETURNING *
      `;
      const result = await client.query(deletePlanSql, [planId, userId]);

      if (result.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      // Commit the transaction
      await client.query('COMMIT');

      res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release();
    }
  });

  // Add a new step to a plan
  app.post(
    '/api/plans/:planId/steps',
    authMiddleware,
    async (req, res, next) => {
      const { planId } = req.params;
      const userId = req.user?.userId;
      const newStep: Omit<PlanStep, 'planStepId'> = req.body;

      const client = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await client.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        // Insert the new step
        const insertStepSql = `
        INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
        const result = await client.query(insertStepSql, [
          planId,
          null, // Assuming new steps don't have a template
          newStep.stepDescription,
          newStep.dueDate,
          newStep.completed || false,
        ]);

        const insertedStep: PlanStep = result.rows[0];
        res.status(201).json(insertedStep);
      } catch (err) {
        next(err);
      } finally {
        client.release();
      }
    }
  );

  // Delete a step from a plan
  app.delete(
    '/api/plans/:planId/steps/:stepId',
    authMiddleware,
    async (req, res, next) => {
      const { planId, stepId } = req.params;
      const userId = req.user?.userId;

      const client = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await client.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        // Delete the step
        const deleteStepSql = `
        DELETE FROM "PlanSteps"
        WHERE "planStepId" = $1 AND "userPlanId" = $2
        RETURNING *
      `;
        const result = await client.query(deleteStepSql, [stepId, planId]);

        if (result.rows.length === 0) {
          throw new ClientError(404, 'Step not found');
        }

        res.json({ message: 'Step deleted successfully' });
      } catch (err) {
        next(err);
      } finally {
        client.release();
      }
    }
  );

  // Save place to profile
  app.post(
    '/api/users/:userId/plans',
    authMiddleware,
    async (req, res, next) => {
      const { userId } = req.params;
      const { planId } = req.body;
      const authenticatedUserId = req.user?.userId;

      if (parseInt(userId) !== authenticatedUserId) {
        return next(
          new ClientError(403, 'Unauthorized to save plan for this user')
        );
      }

      const client = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await client.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(
            404,
            'Plan not found or does not belong to the user'
          );
        }

        // The plan already belongs to the user, so we don't need to do anything else
        res.json({ message: 'Plan saved to profile successfully' });
      } catch (err) {
        next(err);
      } finally {
        client.release();
      }
    }
  );
}

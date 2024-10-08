import express from 'express';
import { Pool } from 'pg';
import { authMiddleware, ClientError } from './index';
import type { UserPlan, PlanStep } from '../../client/src/types';

/**
 * Sets up all plan-related routes for the application
 * @param app - Express application instance
 * @param pool - PostgreSQL connection pool
 */
export function setupPlanRoutes(app: express.Application, pool: Pool): void {
  /**
   * Fetch a specific plan
   */
  app.get('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;

    const db = await pool.connect();
    try {
      const planSql = `
      SELECT up.*, gs.name as "grassSpeciesName"
      FROM "UserPlans" up
      JOIN "GrassSpecies" gs ON up."grassSpeciesId" = gs."grassSpeciesId"
      WHERE up."userPlanId" = $1 AND up."userId" = $2
    `;
      const planResult = await db.query(planSql, [planId, userId]);

      if (planResult.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      const plan = planResult.rows[0];

      // Generate default planTitle if not set
      if (!plan.planTitle) {
        plan.planTitle = `${plan.grassSpeciesName} ${
          plan.planType === 'new_lawn' ? 'New Grow' : 'Improvement'
        } Plan`;
      }

      // Fetch the steps for the plan
      const stepsSql = `
        SELECT * FROM "PlanSteps"
        WHERE "userPlanId" = $1
        ORDER BY "stepOrder" ASC, "createdAt" ASC
      `;
      const stepsResult = await db.query(stepsSql, [planId]);

      const userPlan: UserPlan = {
        ...plan,
        steps: stepsResult.rows.filter((step) => step.planStepId !== null),
      };

      res.json(userPlan);
    } catch (err) {
      next(err);
    } finally {
      db.release();
    }
  });

  /**
   * Update a specific plan
   */
  app.put('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;
    const updatedPlan: UserPlan = req.body;

    const db = await pool.connect();
    try {
      await db.query('BEGIN');

      // Update the plan
      const updatePlanSql = `
      UPDATE "UserPlans"
      SET "grassSpeciesId" = $1, "planType" = $2, "isCompleted" = $3, "isArchived" = $4, "establishmentType" = $5, "planTitle" = $6
      WHERE "userPlanId" = $7 AND "userId" = $8
      RETURNING *
    `;
      const planResult = await db.query(updatePlanSql, [
        updatedPlan.grassSpeciesId,
        updatedPlan.planType,
        updatedPlan.isCompleted || false,
        updatedPlan.isArchived || false,
        updatedPlan.establishmentType,
        updatedPlan.planTitle,
        planId,
        userId,
      ]);

      if (planResult.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      // Update or insert steps
      for (const step of updatedPlan.steps) {
        if (step.planStepId) {
          // Update existing step
          const updateStepSql = `
            UPDATE "PlanSteps"
            SET "stepDescription" = $1, "dueDate" = $2, "completed" = $3
            WHERE "planStepId" = $4 AND "userPlanId" = $5
          `;
          await db.query(updateStepSql, [
            step.stepDescription,
            step.dueDate,
            step.completed,
            step.planStepId,
            planId,
          ]);
        } else {
          // Insert new step
          const insertStepSql = `
            INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed")
            VALUES ($1, $2, $3, $4, $5)
          `;
          await db.query(insertStepSql, [
            planId,
            null,
            step.stepDescription,
            step.dueDate,
            step.completed,
          ]);
        }
      }

      await db.query('COMMIT');

      // Fetch the updated plan with grass species name
      const updatedPlanSql = `
      SELECT up.*, gs.name as "grassSpeciesName"
      FROM "UserPlans" up
      JOIN "GrassSpecies" gs ON up."grassSpeciesId" = gs."grassSpeciesId"
      WHERE up."userPlanId" = $1
    `;
      const updatedPlanResult = await db.query(updatedPlanSql, [planId]);

      const finalPlan: UserPlan = {
        ...updatedPlanResult.rows[0],
        steps: updatedPlan.steps, // Use the steps from the request body
      };

      res.json(finalPlan);
    } catch (err) {
      await db.query('ROLLBACK');
      next(err);
    } finally {
      db.release();
    }
  });

  /**
   * Fetch all plans for a specific user
   */
  app.get(
    '/api/users/:userId/plans',
    authMiddleware,
    async (req, res, next) => {
      const { userId } = req.params;
      const authenticatedUserId = req.user?.userId;

      if (parseInt(userId) !== authenticatedUserId) {
        return next(
          new ClientError(403, 'Unauthorized to access plans for this user')
        );
      }

      const db = await pool.connect();
      try {
        const plansSql = `
      SELECT up.*, gs.name as "grassSpeciesName", ps.*
      FROM "UserPlans" up
      JOIN "GrassSpecies" gs ON up."grassSpeciesId" = gs."grassSpeciesId"
      LEFT JOIN "PlanSteps" ps ON up."userPlanId" = ps."userPlanId"
      WHERE up."userId" = $1
      ORDER BY up."createdAt" DESC, ps."stepOrder" ASC, ps."dueDate" ASC
    `;
        const plansResult = await db.query(plansSql, [userId]);

        const plans: UserPlan[] = [];
        plansResult.rows.forEach((row) => {
          let plan = plans.find((p) => p.userPlanId === row.userPlanId);
          if (!plan) {
            plan = {
              userPlanId: row.userPlanId,
              userId: row.userId,
              grassSpeciesId: row.grassSpeciesId,
              grassSpeciesName: row.grassSpeciesName,
              establishmentType: row.establishmentType,
              planTitle: row.planTitle,
              planType: row.planType,
              isCompleted: row.isCompleted,
              isArchived: row.isArchived,
              createdAt: row.createdAt,
              completedAt: row.completedAt,
              steps: [],
            };
            plans.push(plan);
          }
          if (row.planStepId) {
            const step: PlanStep = {
              planStepId: row.planStepId,
              userPlanId: row.userPlanId,
              templateId: row.templateId,
              stepDescription: row.stepDescription,
              dueDate: row.dueDate,
              completed: row.completed,
              completedAt: row.completedAt,
              createdAt: row.createdAt,
              stepOrder: row.stepOrder,
            };
            plan.steps.push(step);
          }
        });

        res.json(plans);
      } catch (err) {
        next(err);
      } finally {
        db.release();
      }
    }
  );

  /**
   * Update a specific step in a plan
   */
  app.put(
    '/api/plans/:planId/steps/:stepId',
    authMiddleware,
    async (req, res, next) => {
      const { planId, stepId } = req.params;
      const { completed, completedAt } = req.body;
      const userId = req.user?.userId;

      const db = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await db.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        // Update the step
        const updateStepSql = `
        UPDATE "PlanSteps"
        SET "completed" = $1, "completedAt" = $2
        WHERE "planStepId" = $3 AND "userPlanId" = $4
        RETURNING *
      `;
        const result = await db.query(updateStepSql, [
          completed,
          completedAt,
          stepId,
          planId,
        ]);

        if (result.rows.length === 0) {
          throw new ClientError(404, 'Step not found');
        }

        res.json(result.rows[0]);
      } catch (err) {
        next(err);
      } finally {
        db.release();
      }
    }
  );

  /**
   * Mark a plan as complete
   */
  app.put(
    '/api/plans/:planId/complete',
    authMiddleware,
    async (req, res, next) => {
      const { planId } = req.params;
      const { stepIds } = req.body;
      const userId = req.user?.userId;

      const db = await pool.connect();
      try {
        await db.query('BEGIN');

        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await db.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        if (stepIds && stepIds.length > 0) {
          // Update only the specified steps
          const updateStepsSql = `
          UPDATE "PlanSteps"
          SET "completed" = true, "completedAt" = NOW()
          WHERE "userPlanId" = $1 AND "planStepId" = ANY($2::int[])
          RETURNING *
        `;
          const result = await db.query(updateStepsSql, [planId, stepIds]);

          // Check if all steps are completed
          const checkAllCompletedSql = `
          SELECT COUNT(*) as total, SUM(CASE WHEN completed THEN 1 ELSE 0 END) as completed
          FROM "PlanSteps"
          WHERE "userPlanId" = $1
        `;
          const completionCheckResult = await db.query(checkAllCompletedSql, [
            planId,
          ]);
          const { total, completed } = completionCheckResult.rows[0];

          if (total === completed) {
            // If all steps are completed, mark the plan as completed
            const updatePlanSql = `
            UPDATE "UserPlans"
            SET "isCompleted" = true, "completedAt" = NOW()
            WHERE "userPlanId" = $1
            RETURNING *
          `;
            await db.query(updatePlanSql, [planId]);
          }

          await db.query('COMMIT');

          res.json({
            message: 'Steps completed successfully',
            completedSteps: result.rows,
            planCompleted: total === completed,
          });
        } else {
          // If no stepIds provided, complete all steps (existing behavior)
          const updatePlanSql = `
          UPDATE "UserPlans"
          SET "isCompleted" = true, "completedAt" = NOW()
          WHERE "userPlanId" = $1
          RETURNING *
        `;
          const planResult = await db.query(updatePlanSql, [planId]);

          const updateStepsSql = `
          UPDATE "PlanSteps"
          SET "completed" = true, "completedAt" = NOW()
          WHERE "userPlanId" = $1 AND "completed" = false
          RETURNING *
        `;
          const stepsResult = await db.query(updateStepsSql, [planId]);

          await db.query('COMMIT');

          res.json({
            message: 'Plan and all steps completed successfully',
            completedPlan: planResult.rows[0],
            completedSteps: stepsResult.rows,
          });
        }
      } catch (err) {
        await db.query('ROLLBACK');
        next(err);
      } finally {
        db.release();
      }
    }
  );

  /**
   * Delete a plan
   */
  app.delete('/api/plans/:planId', authMiddleware, async (req, res, next) => {
    const { planId } = req.params;
    const userId = req.user?.userId;

    const db = await pool.connect();
    try {
      await db.query('BEGIN');

      // Delete associated steps
      const deleteStepsSql = `
        DELETE FROM "PlanSteps"
        WHERE "userPlanId" = $1
      `;
      await db.query(deleteStepsSql, [planId]);

      // Delete the plan
      const deletePlanSql = `
        DELETE FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
        RETURNING *
      `;
      const result = await db.query(deletePlanSql, [planId, userId]);

      if (result.rows.length === 0) {
        throw new ClientError(404, 'Plan not found');
      }

      await db.query('COMMIT');

      res.json({ message: 'Plan deleted successfully' });
    } catch (err) {
      await db.query('ROLLBACK');
      next(err);
    } finally {
      db.release();
    }
  });

  /**
   * Add a new step to a plan
   */
  app.post(
    '/api/plans/:planId/steps',
    authMiddleware,
    async (req, res, next) => {
      const { planId } = req.params;
      const userId = req.user?.userId;
      const newStep: Omit<PlanStep, 'planStepId'> = {
        ...req.body,
        completed: false, // Ensure completed is always set to false for new steps
      };

      const db = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
      SELECT * FROM "UserPlans"
      WHERE "userPlanId" = $1 AND "userId" = $2
    `;
        const planResult = await db.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        // Insert the new step
        const insertStepSql = `
      INSERT INTO "PlanSteps" ("userPlanId", "templateId", "stepDescription", "dueDate", "completed", "stepOrder")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const result = await db.query(insertStepSql, [
          planId,
          newStep.templateId,
          newStep.stepDescription,
          newStep.dueDate,
          newStep.completed,
          newStep.stepOrder,
        ]);

        const insertedStep: PlanStep = result.rows[0];
        res.status(201).json(insertedStep);
      } catch (err) {
        next(err);
      } finally {
        db.release();
      }
    }
  );

  /**
   * Delete a step from a plan
   */
  app.delete(
    '/api/plans/:planId/steps/:stepId',
    authMiddleware,
    async (req, res, next) => {
      const { planId, stepId } = req.params;
      const userId = req.user?.userId;

      const db = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await db.query(checkPlanSql, [planId, userId]);

        if (planResult.rows.length === 0) {
          throw new ClientError(404, 'Plan not found');
        }

        // Delete the step
        const deleteStepSql = `
        DELETE FROM "PlanSteps"
        WHERE "planStepId" = $1 AND "userPlanId" = $2
        RETURNING *
      `;
        const result = await db.query(deleteStepSql, [stepId, planId]);

        if (result.rows.length === 0) {
          throw new ClientError(404, 'Step not found');
        }

        res.json({ message: 'Step deleted successfully' });
      } catch (err) {
        next(err);
      } finally {
        db.release();
      }
    }
  );

  /**
   * Save plan to user profile
   */
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

      const db = await pool.connect();
      try {
        // Check if the plan exists and belongs to the user
        const checkPlanSql = `
        SELECT * FROM "UserPlans"
        WHERE "userPlanId" = $1 AND "userId" = $2
      `;
        const planResult = await db.query(checkPlanSql, [planId, userId]);

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
        db.release();
      }
    }
  );
}

set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

-- Users table (unchanged)
CREATE TABLE "Users" (
  "userId" serial PRIMARY KEY,
  "username" text NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- Updated GrassSpecies table
CREATE TABLE "GrassSpecies" (
  "grassSpeciesId" serial PRIMARY KEY,
  "name" text NOT NULL,
  "description" text,
  "idealTempMin" numeric,
  "idealTempMax" numeric,
  "idealRainfallMin" numeric,
  "idealRainfallMax" numeric,
  "idealHardinessZone" text,
  "idealKoppenZone" text,
  "idealSpringTempMin" numeric,
  "idealSpringTempMax" numeric,
  "idealSummerTempMin" numeric,
  "idealSummerTempMax" numeric,
  "idealFallTempMin" numeric,
  "idealFallTempMax" numeric,
  "idealWinterTempMin" numeric,
  "idealWinterTempMax" numeric,
  "idealSpringRainfallMin" numeric,
  "idealSpringRainfallMax" numeric,
  "idealSummerRainfallMin" numeric,
  "idealSummerRainfallMax" numeric,
  "idealFallRainfallMin" numeric,
  "idealFallRainfallMax" numeric,
  "idealWinterRainfallMin" numeric,
  "idealWinterRainfallMax" numeric,
  "minGrowingDays" integer,
  "idealEcoregion" text,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- PlanStepTemplates table (unchanged)
CREATE TABLE "PlanStepTemplates" (
  "templateId" serial PRIMARY KEY,
  "grassSpeciesId" integer NOT NULL,
  "planType" text NOT NULL,
  "stepOrder" integer NOT NULL,
  "stepDescription" text NOT NULL,
  "estimatedDuration" interval,
  "intervalToNextStep" interval,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- UserPlans table (unchanged)
CREATE TABLE "UserPlans" (
  "userPlanId" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "grassSpeciesId" integer NOT NULL,
  "planType" text NOT NULL,
  "zipcode" text NOT NULL,
  "matchPercentage" numeric,
  "isCompleted" boolean NOT NULL DEFAULT false,
  "isArchived" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- PlanSteps table (unchanged)
CREATE TABLE "PlanSteps" (
  "planStepId" serial PRIMARY KEY,
  "userPlanId" integer NOT NULL,
  "templateId" integer NOT NULL,
  "stepDescription" text NOT NULL,
  "dueDate" date,
  "completed" boolean NOT NULL DEFAULT false,
  "completedAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- Notifications table (unchanged)
CREATE TABLE "Notifications" (
  "notificationId" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "planStepId" integer NOT NULL,
  "message" text NOT NULL,
  "seen" boolean NOT NULL DEFAULT false,
  "createdAt" timestamptz NOT NULL DEFAULT (now())
);

-- Updated ClimateData table
CREATE TABLE "ClimateData" (
  "climateDataId" serial PRIMARY KEY,
  "zipcode" text NOT NULL,
  "avgTemperature" numeric,
  "avgRainfall" numeric,
  "hardinessZone" text,
  "koppenZone" text,
  "ecoregion" text,
  "springTemperature" numeric,
  "summerTemperature" numeric,
  "fallTemperature" numeric,
  "winterTemperature" numeric,
  "springRainfall" numeric,
  "summerRainfall" numeric,
  "fallRainfall" numeric,
  "winterRainfall" numeric,
  "growingDays" integer,
  "lastUpdated" timestamptz NOT NULL DEFAULT (now())
);

-- Comments (unchanged)
COMMENT ON COLUMN "PlanStepTemplates"."planType" IS 'new_lawn or lawn_improvement';
COMMENT ON COLUMN "UserPlans"."planType" IS 'new_lawn or lawn_improvement';

-- Foreign key constraints (unchanged)
ALTER TABLE "PlanStepTemplates" ADD FOREIGN KEY ("grassSpeciesId") REFERENCES "GrassSpecies" ("grassSpeciesId");
ALTER TABLE "UserPlans" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");
ALTER TABLE "UserPlans" ADD FOREIGN KEY ("grassSpeciesId") REFERENCES "GrassSpecies" ("grassSpeciesId");
ALTER TABLE "PlanSteps" ADD FOREIGN KEY ("userPlanId") REFERENCES "UserPlans" ("userPlanId");
ALTER TABLE "PlanSteps" ADD FOREIGN KEY ("templateId") REFERENCES "PlanStepTemplates" ("templateId");
ALTER TABLE "Notifications" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("userId");
ALTER TABLE "Notifications" ADD FOREIGN KEY ("planStepId") REFERENCES "PlanSteps" ("planStepId");
ALTER TABLE "ClimateData" ADD CONSTRAINT "unique_zipcode" UNIQUE ("zipcode");

-- Indexes for performance (unchanged)
CREATE INDEX idx_userplans_userid ON "UserPlans" ("userId");
CREATE INDEX idx_plansteps_userplanid ON "PlanSteps" ("userPlanId");
CREATE INDEX idx_notifications_userid ON "Notifications" ("userId");
CREATE INDEX idx_climatedata_zipcode ON "ClimateData" ("zipcode");


ALTER TABLE "ClimateData"
ADD COLUMN "monthlyTemperature" jsonb,
ADD COLUMN "monthlyRainfall" jsonb;

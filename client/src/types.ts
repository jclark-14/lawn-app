export type User = {
  userId: number;
  username: string;
  hashedPassword: string;
};

export type Auth = {
  username: string;
  password: string;
};

export type ClimateData = {
  avgTemperature: string | number;
  avgRainfall: string | number;
  hardinessZone: string;
  koppenZone: string;
  ecoregion: string;
  springTemperature: string | number;
  summerTemperature: string | number;
  fallTemperature: string | number;
  winterTemperature: string | number;
  springRainfall: string | number;
  summerRainfall: string | number;
  fallRainfall: string | number;
  winterRainfall: string | number;
  growingDays: string | number;
  monthlyTemperature: {
    [key: string]: number;
  };
  monthlyRainfall: {
    [key: string]: number;
  };
};

// In your types.ts file or wherever you define your types

export type GrassSpecies = {
  grassSpeciesId: number;
  name: string;
  description: string;
  idealTempMin: number | null;
  idealTempMax: number | null;
  idealRainfallMin: number | null;
  idealRainfallMax: number | null;
  idealHardinessZone: string | null;
  idealKoppenZone: string | null;
  idealSpringTempMin: number | null;
  idealSpringTempMax: number | null;
  idealSummerTempMin: number | null;
  idealSummerTempMax: number | null;
  idealFallTempMin: number | null;
  idealFallTempMax: number | null;
  idealWinterTempMin: number | null;
  idealWinterTempMax: number | null;
  idealSpringRainfallMin: number | null;
  idealSpringRainfallMax: number | null;
  idealSummerRainfallMin: number | null;
  idealSummerRainfallMax: number | null;
  idealFallRainfallMin: number | null;
  idealFallRainfallMax: number | null;
  idealWinterRainfallMin: number | null;
  idealWinterRainfallMax: number | null;
  minGrowingDays: number | null;
  idealEcoregion: string | null;
  match_percentage: number;
  matchTier: number; // Add this line
};

export type GrassSpeciesWithClimate = GrassSpecies & {
  climateData: ClimateData;
};

export type PlanStep = {
  planStepId: number;
  userPlanId: number;
  templateId: number | null;
  stepDescription: string;
  dueDate: string;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  stepOrder?: number | null;
};

export type UserPlan = {
  userPlanId: number;
  userId: number;
  grassSpeciesId: number;
  grassSpeciesName: string;
  establishmentType: 'sod' | 'sod_plugs' | 'plugs' | 'seed';
  planType: 'lawn_improvement' | 'new_lawn';
  isCompleted: boolean;
  isArchived: boolean;
  createdAt: string;
  steps: PlanStep[];
};

export type Notification = {
  notificationId: number;
  userId: number;
  planStepId: number;
  message: string;
  seen: boolean;
  createdAt: Date;
};

export type ApiClimateData = {
  ZIP: string;
  ZIP_name: string;
  plant_hardiness_zone: string;
  koppen_zone: string;
  ecoregion: string;
  avg_first_frost: string;
  avg_last_frost: string;
  annual_averages: {
    [month: string]: {
      min: string;
      max: string;
      precip: string;
    };
  };
};

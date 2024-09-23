import { Pool } from 'pg';
import { type ClimateData, fetchClimateDataFromAPI } from './climateApi.js';
import { ClientError } from './index.js';

export async function getGrassSpeciesForZipcode(
  db: Pool,
  zipcode: string
): Promise<any[]> {
  if (!/^\d{5}$/.test(zipcode)) {
    throw new ClientError(400, 'Invalid zipcode');
  }
  try {
    let climateData = await getClimateData(db, zipcode);
    if (!climateData) {
      climateData = await fetchAndStoreClimateData(db, zipcode);
    }
    const grassSpecies = await matchGrassSpecies(db, climateData);
    if (grassSpecies.length === 0) {
      console.log(`No matching grass species found for zipcode ${zipcode}`);
    }
    return grassSpecies;
  } catch (error) {
    console.error(`Error in getGrassSpeciesForZipcode.`);
    throw error;
  }
}

async function getClimateData(
  db: Pool,
  zipcode: string
): Promise<ClimateData | null> {
  try {
    const result = await db.query<ClimateData>(
      'SELECT * FROM "ClimateData" WHERE zipcode = $1',
      [zipcode]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(`Error fetching climate data`);
    throw new Error('Failed to fetch climate data');
  }
}

async function fetchAndStoreClimateData(
  db: Pool,
  zipcode: string
): Promise<ClimateData> {
  try {
    const apiClimateData = await fetchClimateDataFromAPI(zipcode);
    if (!apiClimateData) {
      throw new Error('Failed to fetch climate data from API');
    }
    await db.query(
      `INSERT INTO "ClimateData" (zipcode, "avgTemperature", "avgRainfall", "hardinessZone", "koppenZone",
      "springTemperature", "summerTemperature", "fallTemperature", "winterTemperature",
      "springRainfall", "summerRainfall", "fallRainfall", "winterRainfall", "growingDays", "ecoregion")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       ON CONFLICT (zipcode) DO UPDATE
       SET "avgTemperature" = $2, "avgRainfall" = $3, "hardinessZone" = $4, "koppenZone" = $5,
       "springTemperature" = $6, "summerTemperature" = $7, "fallTemperature" = $8, "winterTemperature" = $9,
       "springRainfall" = $10, "summerRainfall" = $11, "fallRainfall" = $12, "winterRainfall" = $13,
       "growingDays" = $14, "ecoregion" = $15, "lastUpdated" = NOW()`,
      [
        zipcode,
        apiClimateData.avgTemperature,
        apiClimateData.avgRainfall,
        apiClimateData.hardinessZone,
        apiClimateData.koppenZone,
        apiClimateData.springTemperature,
        apiClimateData.summerTemperature,
        apiClimateData.fallTemperature,
        apiClimateData.winterTemperature,
        apiClimateData.springRainfall,
        apiClimateData.summerRainfall,
        apiClimateData.fallRainfall,
        apiClimateData.winterRainfall,
        apiClimateData.growingDays,
        apiClimateData.ecoregion,
      ]
    );
    return apiClimateData;
  } catch (error) {
    console.error(`Error fetching and storing climate data`);
    throw new Error('Failed to fetch and store climate data');
  }
}

async function matchGrassSpecies(
  db: Pool,
  climateData: ClimateData
): Promise<any[]> {
  if (!climateData) {
    throw new Error('Climate data is required for matching grass species');
  }
  try {
    const result = await db.query(
      `SELECT gs.*,
  (
    -- Seasonal temperature matching (30% weight)
    (CASE WHEN $1 BETWEEN gs."idealSpringTempMin" AND gs."idealSpringTempMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $2 BETWEEN gs."idealSummerTempMin" AND gs."idealSummerTempMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $3 BETWEEN gs."idealFallTempMin" AND gs."idealFallTempMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $4 BETWEEN gs."idealWinterTempMin" AND gs."idealWinterTempMax" THEN 0.075 ELSE 0 END) +

    -- Seasonal rainfall matching (30% weight)
    (CASE WHEN $5 BETWEEN gs."idealSpringRainfallMin" AND gs."idealSpringRainfallMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $6 BETWEEN gs."idealSummerRainfallMin" AND gs."idealSummerRainfallMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $7 BETWEEN gs."idealFallRainfallMin" AND gs."idealFallRainfallMax" THEN 0.075 ELSE 0 END +
     CASE WHEN $8 BETWEEN gs."idealWinterRainfallMin" AND gs."idealWinterRainfallMax" THEN 0.075 ELSE 0 END) +

    -- Growing season length (10% weight)
    (CASE WHEN $9 >= gs."minGrowingDays" THEN 0.1 ELSE 0 END) +

    -- Hardiness zone matching (20% weight)
    (CASE WHEN $10 = ANY(string_to_array(gs."idealHardinessZone", ',')) THEN 0.2 ELSE 0 END) +

    -- Koppen classification matching (5% weight)
    (CASE WHEN LEFT($11, 3) = LEFT(gs."idealKoppenZone", 3) THEN 0.05 ELSE 0 END) +

    -- Ecoregion matching (5% weight)
    (CASE WHEN $12 = gs."idealEcoregion" THEN 0.05 ELSE 0 END)
  ) * 100 AS match_percentage
FROM "GrassSpecies" gs
WHERE (
  (CASE WHEN $1 BETWEEN gs."idealSpringTempMin" AND gs."idealSpringTempMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $2 BETWEEN gs."idealSummerTempMin" AND gs."idealSummerTempMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $3 BETWEEN gs."idealFallTempMin" AND gs."idealFallTempMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $4 BETWEEN gs."idealWinterTempMin" AND gs."idealWinterTempMax" THEN 0.075 ELSE 0 END) +
  (CASE WHEN $5 BETWEEN gs."idealSpringRainfallMin" AND gs."idealSpringRainfallMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $6 BETWEEN gs."idealSummerRainfallMin" AND gs."idealSummerRainfallMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $7 BETWEEN gs."idealFallRainfallMin" AND gs."idealFallRainfallMax" THEN 0.075 ELSE 0 END +
   CASE WHEN $8 BETWEEN gs."idealWinterRainfallMin" AND gs."idealWinterRainfallMax" THEN 0.075 ELSE 0 END) +
  (CASE WHEN $9 >= gs."minGrowingDays" THEN 0.1 ELSE 0 END) +
  (CASE WHEN $10 = ANY(string_to_array(gs."idealHardinessZone", ',')) THEN 0.2 ELSE 0 END) +
  (CASE WHEN LEFT($11, 3) = LEFT(gs."idealKoppenZone", 3) THEN 0.05 ELSE 0 END) +
  (CASE WHEN $12 = gs."idealEcoregion" THEN 0.05 ELSE 0 END)
) > 0
ORDER BY match_percentage DESC,
         (ABS($1 - gs."idealSpringTempMin") + ABS($2 - gs."idealSummerTempMin") +
          ABS($3 - gs."idealFallTempMin") + ABS($4 - gs."idealWinterTempMin")) ASC
LIMIT 3`,
      [
        climateData.springTemperature,
        climateData.summerTemperature,
        climateData.fallTemperature,
        climateData.winterTemperature,
        climateData.springRainfall,
        climateData.summerRainfall,
        climateData.fallRainfall,
        climateData.winterRainfall,
        climateData.growingDays,
        climateData.hardinessZone,
        climateData.koppenZone,
        climateData.ecoregion,
      ]
    );
    return result.rows;
  } catch (error) {
    console.error(`Error matching grass species`);
    throw new Error('Failed to match grass species');
  }
}

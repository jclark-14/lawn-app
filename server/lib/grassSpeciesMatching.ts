import { Pool } from 'pg';
import { fetchClimateDataFromAPI } from './climateApi.js';
import { ClientError } from './index.js';
import {
  type GrassSpeciesWithClimate,
  type ClimateData,
  GrassSpecies,
} from '../../client/src/types';

/**
 * Match grass species based on the climate data.
 * This function uses a tiered approach to find the best matching grass species.
 * It starts with strict criteria and gradually relaxes them if no matches are found.
 *
 * @param db - PostgreSQL connection pool
 * @param climateData - The climate data to match against
 * @returns Promise resolving to an array of matched grass species
 */
export async function getGrassSpeciesForZipcode(
  db: Pool,
  zipcode: string
): Promise<GrassSpeciesWithClimate[]> {
  // Validate zipcode format (must be 5 digits)
  if (!/^\d{5}$/.test(zipcode)) {
    throw new ClientError(400, 'Invalid zipcode');
  }

  try {
    console.log(`Fetching climate data for zipcode: ${zipcode}`);

    // Try to retrieve climate data from the database, or fetch from API if not found
    const climateData =
      (await getClimateData(db, zipcode)) ||
      (await fetchAndStoreClimateData(db, zipcode));

    console.log(
      `Climate data for ${zipcode}:`,
      JSON.stringify(climateData, null, 2)
    );

    // Match grass species based on climate data
    const grassSpecies = await matchGrassSpecies(db, climateData);

    if (grassSpecies.length === 0) {
      console.log(`No matching grass species found for zipcode ${zipcode}`);
    } else {
      console.log(
        `Found ${grassSpecies.length} matches for zipcode ${zipcode} at tier ${grassSpecies[0].matchTier}`
      );
    }

    // Combine the climate data with the matched grass species data
    return grassSpecies.map((species) => ({ ...species, climateData }));
  } catch (error) {
    console.error(`Error in getGrassSpeciesForZipcode: ${error}`);
    throw error;
  }
}

/**
 * Retrieve climate data from the database.
 *
 * @param db - PostgreSQL connection pool
 * @param zipcode - The zipcode to retrieve climate data for
 * @returns Promise resolving to climate data or null if not found
 */
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
    console.error(`Error fetching climate data: ${error}`);
    throw new Error('Failed to fetch climate data');
  }
}

/**
 * Fetch climate data from an external API and store it in the database.
 *
 * @param db - PostgreSQL connection pool
 * @param zipcode - The zipcode to fetch climate data for
 * @returns Promise resolving to the fetched and stored climate data
 */
async function fetchAndStoreClimateData(
  db: Pool,
  zipcode: string
): Promise<ClimateData> {
  try {
    const apiClimateData = await fetchClimateDataFromAPI(zipcode);
    if (!apiClimateData) {
      throw new Error('Failed to fetch climate data from API');
    }

    // Parse and convert API data to ensure correct types
    const parsedData: ClimateData = {
      ...apiClimateData,
      avgTemperature: parseFloat(apiClimateData.avgTemperature.toString()),
      avgRainfall: parseFloat(apiClimateData.avgRainfall.toString()),
      springTemperature: parseFloat(
        apiClimateData.springTemperature.toString()
      ),
      summerTemperature: parseFloat(
        apiClimateData.summerTemperature.toString()
      ),
      fallTemperature: parseFloat(apiClimateData.fallTemperature.toString()),
      winterTemperature: parseFloat(
        apiClimateData.winterTemperature.toString()
      ),
      springRainfall: parseFloat(apiClimateData.springRainfall.toString()),
      summerRainfall: parseFloat(apiClimateData.summerRainfall.toString()),
      fallRainfall: parseFloat(apiClimateData.fallRainfall.toString()),
      winterRainfall: parseFloat(apiClimateData.winterRainfall.toString()),
      growingDays: parseInt(apiClimateData.growingDays.toString(), 10),
      monthlyTemperature: apiClimateData.monthlyTemperature, // Keep as object
      monthlyRainfall: apiClimateData.monthlyRainfall, // Keep as object
    };

    // Insert or update the climate data in the database
    await db.query(
      `INSERT INTO "ClimateData" (
        zipcode, "avgTemperature", "avgRainfall", "hardinessZone", "koppenZone",
        "springTemperature", "summerTemperature", "fallTemperature", "winterTemperature",
        "springRainfall", "summerRainfall", "fallRainfall", "winterRainfall", "growingDays", "ecoregion",
        "monthlyTemperature", "monthlyRainfall"
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      ON CONFLICT (zipcode) DO UPDATE
      SET
        "avgTemperature" = $2, "avgRainfall" = $3, "hardinessZone" = $4, "koppenZone" = $5,
        "springTemperature" = $6, "summerTemperature" = $7, "fallTemperature" = $8, "winterTemperature" = $9,
        "springRainfall" = $10, "summerRainfall" = $11, "fallRainfall" = $12, "winterRainfall" = $13,
        "growingDays" = $14, "ecoregion" = $15, "monthlyTemperature" = $16, "monthlyRainfall" = $17,
        "lastUpdated" = NOW()`,
      [
        zipcode,
        parsedData.avgTemperature,
        parsedData.avgRainfall,
        parsedData.hardinessZone,
        parsedData.koppenZone,
        parsedData.springTemperature,
        parsedData.summerTemperature,
        parsedData.fallTemperature,
        parsedData.winterTemperature,
        parsedData.springRainfall,
        parsedData.summerRainfall,
        parsedData.fallRainfall,
        parsedData.winterRainfall,
        parsedData.growingDays,
        parsedData.ecoregion,
        JSON.stringify(parsedData.monthlyTemperature), // Convert to JSON string for storage
        JSON.stringify(parsedData.monthlyRainfall), // Convert to JSON string for storage
      ]
    );

    return parsedData;
  } catch (error) {
    console.error(`Error fetching and storing climate data: ${error}`);
    throw new Error('Failed to fetch and store climate data');
  }
}

/**
 * Match grass species based on the climate data.
 *
 * @param db - PostgreSQL connection pool
 * @param climateData - The climate data to match against
 * @returns Promise resolving to an array of matched grass species
 */
async function matchGrassSpecies(
  db: Pool,
  climateData: ClimateData
): Promise<GrassSpecies[]> {
  if (!climateData) {
    throw new Error('Climate data is required for matching grass species');
  }

  // Helper functions to safely parse float and integer values
  const safeParseFloat = (value: string | number | undefined): number =>
    typeof value === 'number' ? value : parseFloat(value as string) || 0;

  const safeParseInt = (value: string | number | undefined): number =>
    typeof value === 'number'
      ? Math.round(value)
      : parseInt(value as string, 10) || 0;

  // Define matching tiers with different thresholds and relax factors
  // Each tier represents a different level of strictness in matching
  // As we progress through tiers, we relax the matching criteria
  const matchingTiers = [
    { threshold: 60, relaxFactor: 1.5 }, // Strict matching
    { threshold: 40, relaxFactor: 2 }, // Moderate matching
    { threshold: 20, relaxFactor: 2.5 }, // Relaxed matching
  ];
  // Try to match grass species for each tier
  for (const tier of matchingTiers) {
    console.log(
      `Attempting to match grass species with tier: ${tier.threshold}, relaxFactor: ${tier.relaxFactor}`
    );
    try {
      // The query calculates a score for each grass species based on how well it matches the climate data
      // Factors considered include temperature, rainfall, growing season length, hardiness zone, and Koppen classification
      // A popularity bonus is also added for certain grass types in specific climate zones
      const result = await db.query(
        `
        WITH match_calculation AS (
          SELECT gs.*,
          (
            -- Temperature matching (50% weight)
            (CASE
              WHEN $1 BETWEEN COALESCE(gs."idealSpringTempMin", 0) * ${tier.relaxFactor} AND COALESCE(gs."idealSpringTempMax", 100) * ${tier.relaxFactor} THEN 12.5
              ELSE 12.5 / (1 + ABS($1 - (COALESCE(gs."idealSpringTempMin", 0) + COALESCE(gs."idealSpringTempMax", 100)) / 2) / 10)
            END +
            CASE
              WHEN $2 BETWEEN COALESCE(gs."idealSummerTempMin", 0) * ${tier.relaxFactor} AND COALESCE(gs."idealSummerTempMax", 100) * ${tier.relaxFactor} THEN 12.5
              ELSE 12.5 / (1 + ABS($2 - (COALESCE(gs."idealSummerTempMin", 0) + COALESCE(gs."idealSummerTempMax", 100)) / 2) / 10)
            END +
            CASE
              WHEN $3 BETWEEN COALESCE(gs."idealFallTempMin", 0) * ${tier.relaxFactor} AND COALESCE(gs."idealFallTempMax", 100) * ${tier.relaxFactor} THEN 12.5
              ELSE 12.5 / (1 + ABS($3 - (COALESCE(gs."idealFallTempMin", 0) + COALESCE(gs."idealFallTempMax", 100)) / 2) / 10)
            END +
            CASE
              WHEN $4 BETWEEN COALESCE(gs."idealWinterTempMin", 0) * ${tier.relaxFactor} AND COALESCE(gs."idealWinterTempMax", 100) * ${tier.relaxFactor} THEN 12.5
              ELSE 12.5 / (1 + ABS($4 - (COALESCE(gs."idealWinterTempMin", 0) + COALESCE(gs."idealWinterTempMax", 100)) / 2) / 10)
            END) +

            -- Rainfall matching (30% weight)
            (CASE
              WHEN $5 BETWEEN COALESCE(gs."idealSpringRainfallMin", 0) / ${tier.relaxFactor} AND COALESCE(gs."idealSpringRainfallMax", 10) * ${tier.relaxFactor} THEN 7.5
              ELSE 7.5 / (1 + ABS($5 - (COALESCE(gs."idealSpringRainfallMin", 0) + COALESCE(gs."idealSpringRainfallMax", 10)) / 2) / 2)
            END +
            CASE
              WHEN $6 BETWEEN COALESCE(gs."idealSummerRainfallMin", 0) / ${tier.relaxFactor} AND COALESCE(gs."idealSummerRainfallMax", 10) * ${tier.relaxFactor} THEN 7.5
              ELSE 7.5 / (1 + ABS($6 - (COALESCE(gs."idealSummerRainfallMin", 0) + COALESCE(gs."idealSummerRainfallMax", 10)) / 2) / 2)
            END +
            CASE
              WHEN $7 BETWEEN COALESCE(gs."idealFallRainfallMin", 0) / ${tier.relaxFactor} AND COALESCE(gs."idealFallRainfallMax", 10) * ${tier.relaxFactor} THEN 7.5
              ELSE 7.5 / (1 + ABS($7 - (COALESCE(gs."idealFallRainfallMin", 0) + COALESCE(gs."idealFallRainfallMax", 10)) / 2) / 2)
            END +
            CASE
              WHEN $8 BETWEEN COALESCE(gs."idealWinterRainfallMin", 0) / ${tier.relaxFactor} AND COALESCE(gs."idealWinterRainfallMax", 10) * ${tier.relaxFactor} THEN 7.5
              ELSE 7.5 / (1 + ABS($8 - (COALESCE(gs."idealWinterRainfallMin", 0) + COALESCE(gs."idealWinterRainfallMax", 10)) / 2) / 2)
            END) +

            -- Growing season length (10% weight)
            (CASE WHEN $9 >= COALESCE(gs."minGrowingDays", 0) / ${tier.relaxFactor} THEN 10 ELSE 10 * $9 / COALESCE(gs."minGrowingDays", 365) END) +

            -- Hardiness zone matching (5% weight)
            (CASE
              WHEN SUBSTRING($10, '^[0-9]+') = SUBSTRING(gs."idealHardinessZone", '^[0-9]+') THEN 5
              WHEN ABS(CAST(SUBSTRING($10, '^[0-9]+') AS INTEGER) - CAST(SUBSTRING(gs."idealHardinessZone", '^[0-9]+') AS INTEGER)) <= 1 THEN 2.5
              ELSE 0
            END) +

            -- Koppen classification matching (5% weight)
            (CASE
              WHEN LEFT($11, 3) = LEFT(gs."idealKoppenZone", 3) THEN 5
              WHEN LEFT($11, 2) = LEFT(gs."idealKoppenZone", 2) THEN 2.5
              ELSE 0
            END) +

            -- Popularity bonus (up to 10 points)
            CASE
              WHEN gs.name = 'Bermuda Grass' AND $11 = 'Cfa' THEN 10
              WHEN gs.name = 'Zoysia Grass' AND $11 = 'Cfa' THEN 8
              WHEN gs.name = 'Tall Fescue' AND $11 = 'Cfa' THEN 6
              ELSE 0
            END
          ) AS raw_score
          FROM "GrassSpecies" gs
        ),
        max_score AS (
          SELECT MAX(raw_score) as max_raw_score FROM match_calculation
        )
        SELECT
          mc.*,
          CASE
            WHEN ms.max_raw_score > 0 THEN (mc.raw_score / ms.max_raw_score) * 100
            ELSE 0
          END AS match_percentage
        FROM match_calculation mc, max_score ms
        WHERE (mc.raw_score / ms.max_raw_score) * 100 >= ${tier.threshold}
        ORDER BY match_percentage DESC
        LIMIT 5
      `,
        [
          safeParseFloat(climateData.springTemperature),
          safeParseFloat(climateData.summerTemperature),
          safeParseFloat(climateData.fallTemperature),
          safeParseFloat(climateData.winterTemperature),
          safeParseFloat(climateData.springRainfall),
          safeParseFloat(climateData.summerRainfall),
          safeParseFloat(climateData.fallRainfall),
          safeParseFloat(climateData.winterRainfall),
          safeParseInt(climateData.growingDays),
          climateData.hardinessZone,
          climateData.koppenZone,
        ]
      );

      console.log(
        `Query results for tier ${tier.threshold}:`,
        JSON.stringify(result.rows, null, 2)
      );

      // If matches are found, return them with match percentage and tier information
      // The match percentage represents how well the grass species fits the climate data
      // The matchTier indicates which level of matching criteria was used (strict, moderate, or relaxed)
      if (result.rows.length > 0) {
        const matchedSpecies = result.rows.map((row) => ({
          ...row,
          match_percentage: parseFloat(row.match_percentage),
          matchTier: tier.threshold,
        }));
        console.log(
          `Matched species:`,
          JSON.stringify(matchedSpecies, null, 2)
        );
        return matchedSpecies;
      } else {
        console.log(`No matches found for tier ${tier.threshold}`);
      }
    } catch (error) {
      console.error(
        `Error matching grass species (Tier ${tier.threshold}):`,
        error
      );
    }
  }

  // If no matches are found across all tiers, return an empty array
  // This indicates that no suitable grass species were found for the given climate data
  console.log(
    `No matching grass species found for climate data:`,
    JSON.stringify(climateData, null, 2)
  );
  return [];
}

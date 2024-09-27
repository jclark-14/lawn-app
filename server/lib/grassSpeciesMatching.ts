import { Pool } from 'pg'; // Import PostgreSQL connection pool
import { fetchClimateDataFromAPI } from './climateApi.js'; // Import function to fetch climate data from external API
import { ClientError } from './index.js'; // Import custom error handler
import {
  type GrassSpeciesWithClimate,
  type ClimateData,
  GrassSpecies,
} from '../../client/src/types'; // Import TypeScript types

// Function to get grass species recommendations for a given zipcode
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

    // Try to retrieve climate data from the database
    let climateData = await getClimateData(db, zipcode);

    // If no data is found, fetch it from an external API and store in the database
    if (!climateData) {
      console.log(
        `Climate data not found in database for zipcode ${zipcode}. Fetching from API.`
      );
      climateData = await fetchAndStoreClimateData(db, zipcode);
    }

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
    const result = grassSpecies.map((species) => ({
      ...species,
      climateData,
    }));

    // Return final result containing grass species and corresponding climate data
    return result;
  } catch (error) {
    console.error(`Error in getGrassSpeciesForZipcode: ${error}`);
    throw error;
  }
}

// Helper function to retrieve climate data from the database
async function getClimateData(
  db: Pool,
  zipcode: string
): Promise<ClimateData | null> {
  try {
    const result = await db.query<ClimateData>(
      'SELECT * FROM "ClimateData" WHERE zipcode = $1',
      [zipcode]
    );
    return result.rows[0] || null; // Return the climate data if found, otherwise return null
  } catch (error) {
    console.error(`Error fetching climate data`);
    throw new Error('Failed to fetch climate data');
  }
}

// Function to fetch climate data from an external API and store it in the database
async function fetchAndStoreClimateData(
  db: Pool,
  zipcode: string
): Promise<ClimateData> {
  try {
    const apiClimateData = await fetchClimateDataFromAPI(zipcode); // Fetch climate data from API
    if (!apiClimateData) {
      throw new Error('Failed to fetch climate data from API');
    }

    // Parse and convert API data to ensure correct types
    const parsedData = {
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
      monthlyTemperature: JSON.stringify(apiClimateData.monthlyTemperature),
      monthlyRainfall: JSON.stringify(apiClimateData.monthlyRainfall),
    };

    // Insert or update the climate data in the database
    await db.query(
      `INSERT INTO "ClimateData" (zipcode, "avgTemperature", "avgRainfall", "hardinessZone", "koppenZone",
      "springTemperature", "summerTemperature", "fallTemperature", "winterTemperature",
      "springRainfall", "summerRainfall", "fallRainfall", "winterRainfall", "growingDays", "ecoregion",
      "monthlyTemperature", "monthlyRainfall")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       ON CONFLICT (zipcode) DO UPDATE
       SET "avgTemperature" = $2, "avgRainfall" = $3, "hardinessZone" = $4, "koppenZone" = $5,
       "springTemperature" = $6, "summerTemperature" = $7, "fallTemperature" = $8, "winterTemperature" = $9,
       "springRainfall" = $10, "summerRainfall" = $11, "fallRainfall" = $12, "winterRainfall" = $13,
       "growingDays" = $14, "ecoregion" = $15, "monthlyTemperature" = $16, "monthlyRainfall" = $17, "lastUpdated" = NOW()`,
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
        parsedData.monthlyTemperature,
        parsedData.monthlyRainfall,
      ]
    );

    // Return the parsed climate data
    return parsedData;
  } catch (error) {
    console.error(`Error fetching and storing climate data`);
    throw new Error('Failed to fetch and store climate data');
  }
}

// Function to match grass species based on the climate data
async function matchGrassSpecies(
  db: Pool,
  climateData: ClimateData
): Promise<GrassSpecies[]> {
  if (!climateData) {
    throw new Error('Climate data is required for matching grass species');
  }

  // Helper functions to safely parse float and integer values
  const safeParseFloat = (value: string | number | undefined): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  const safeParseInt = (value: string | number | undefined): number => {
    if (typeof value === 'number') return Math.round(value);
    if (typeof value === 'string') return parseInt(value, 10) || 0;
    return 0;
  };

  // Define matching tiers with different thresholds and relax factors
  const matchingTiers = [
    { threshold: 60, relaxFactor: 1.5 },
    { threshold: 40, relaxFactor: 2 },
    { threshold: 20, relaxFactor: 2.5 },
  ];

  // Try to match grass species for each tier
  for (const tier of matchingTiers) {
    console.log(
      `Attempting to match grass species with tier: ${tier.threshold}, relaxFactor: ${tier.relaxFactor}`
    );
    try {
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

  console.log(
    `No matching grass species found for climate data:`,
    JSON.stringify(climateData, null, 2)
  );
  return [];
}

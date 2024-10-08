import { type ClimateData, type ApiClimateData } from '../../client/src/types';

const API_KEY = process.env.API_KEY;

const API_URL = 'https://climate-by-zip.p.rapidapi.com/climate';
const API_HOST = 'climate-by-zip.p.rapidapi.com';

export async function fetchClimateDataFromAPI(
  zipcode: string
): Promise<ClimateData> {
  try {
    const apiData = await fetchFromAPI(zipcode);
    return parseClimateData(apiData);
  } catch (error) {
    console.error('Error fetching climate data:', error);
    throw new Error('Failed to fetch climate data');
  }
}

async function fetchFromAPI(zipcode: string): Promise<ApiClimateData> {
  if (!API_KEY) {
    throw new Error('API_KEY is not defined');
  }

  const response = await fetch(`${API_URL}/${zipcode}`, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Parse raw API climate data into a structured ClimateData object
 * @param apiData - Raw climate data from the API
 * @returns Structured ClimateData object
 */
function parseClimateData(apiData: ApiClimateData): ClimateData {
  const monthlyData = Object.values(apiData.annual_averages).slice(0, 12);
  const yearlyData = apiData.annual_averages.Yearly;

  const { monthlyTemperature, monthlyRainfall } =
    processMonthlyData(monthlyData);

  return {
    avgTemperature: calculateAverage(yearlyData.min, yearlyData.max),
    avgRainfall: parseFloat(yearlyData.precip),
    hardinessZone: extractHardinessZone(apiData.plant_hardiness_zone),
    koppenZone: apiData.koppen_zone.split(' - ')[0],
    ecoregion: apiData.ecoregion,
    ...calculateSeasonalAverages(monthlyData),
    growingDays: calculateGrowingDays(
      apiData.avg_last_frost,
      apiData.avg_first_frost
    ),
    monthlyTemperature,
    monthlyRainfall,
  };
}

/**
 * Calculate seasonal averages for temperature or precipitation
 * @param monthlyData - Array of monthly climate data
 * @param type - 'temp' for temperature, 'precip' for precipitation
 * @returns Object with seasonal averages
 */
type SeasonData = {
  winterTemperature: number;
  springTemperature: number;
  summerTemperature: number;
  fallTemperature: number;
  winterRainfall: number;
  springRainfall: number;
  summerRainfall: number;
  fallRainfall: number;
};

function calculateSeasonalAverages(
  monthlyData: Array<{ min: string; max: string; precip: string }>
): SeasonData {
  const seasons = [
    { name: 'winter' as const, months: [11, 0, 1] },
    { name: 'spring' as const, months: [2, 3, 4] },
    { name: 'summer' as const, months: [5, 6, 7] },
    { name: 'fall' as const, months: [8, 9, 10] },
  ];

  return seasons.reduce((acc, season) => {
    const seasonalData = season.months.map((month) => monthlyData[month]);
    acc[`${season.name}Temperature`] = calculateAverage(
      ...seasonalData.flatMap((month) => [
        parseFloat(month.min),
        parseFloat(month.max),
      ])
    );
    acc[`${season.name}Rainfall`] = calculateAverage(
      ...seasonalData.map((month) => parseFloat(month.precip))
    );
    return acc;
  }, {} as SeasonData);
}

/**
 * Calculate the number of growing days between last and first frost dates
 * @param lastFrost - Last frost date string
 * @param firstFrost - First frost date string
 * @returns Number of growing days
 */
function calculateGrowingDays(lastFrost: string, firstFrost: string): number {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDate = (frostDate: string): Date => {
    const [month, day] = frostDate.split(' ');
    return new Date(2023, months.indexOf(month), parseInt(day));
  };

  const lastFrostDate = getDate(lastFrost);
  const firstFrostDate = getDate(firstFrost);

  if (firstFrostDate < lastFrostDate) {
    firstFrostDate.setFullYear(2024);
  }

  return Math.round(
    (firstFrostDate.getTime() - lastFrostDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Process monthly data to create temperature and rainfall objects
 * @param monthlyData - Array of monthly climate data
 * @returns Object containing monthlyTemperature and monthlyRainfall
 */
function processMonthlyData(
  monthlyData: Array<{ min: string; max: string; precip: string }>
): {
  monthlyTemperature: Record<string, number>;
  monthlyRainfall: Record<string, number>;
} {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return monthlyData.reduce(
    (acc, data, index) => {
      const month = months[index];
      acc.monthlyTemperature[month] = calculateAverage(data.min, data.max);
      acc.monthlyRainfall[month] = parseFloat(data.precip);
      return acc;
    },
    { monthlyTemperature: {}, monthlyRainfall: {} } as {
      monthlyTemperature: Record<string, number>;
      monthlyRainfall: Record<string, number>;
    }
  );
}

function calculateAverage(...values: (string | number)[]): number {
  const numbers = values.map((v) =>
    typeof v === 'string' ? parseFloat(v) : v
  );
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

function extractHardinessZone(zoneString: string): string {
  return zoneString.split(':')[0].replace('Zone ', '');
}

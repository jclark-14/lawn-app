export type ClimateData = {
  avgTemperature: number;
  avgRainfall: number;
  hardinessZone: string;
  koppenZone: string;
  ecoregion: string;
  springTemperature: number;
  summerTemperature: number;
  fallTemperature: number;
  winterTemperature: number;
  springRainfall: number;
  summerRainfall: number;
  fallRainfall: number;
  winterRainfall: number;
  growingDays: number;
};

interface ApiClimateData {
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
}

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not found in environment variables');
}

function parseClimateData(apiData: ApiClimateData): ClimateData {
  const hardinessZone = apiData.plant_hardiness_zone
    .split(':')[0]
    .replace('Zone ', '');
  const koppenZone = apiData.koppen_zone.split(' - ')[0];
  const monthlyData = Object.values(apiData.annual_averages).slice(0, 12);
  const yearlyData = apiData.annual_averages.Yearly;
  const avgTemperature =
    (parseFloat(yearlyData.min) + parseFloat(yearlyData.max)) / 2;
  const avgRainfall = parseFloat(yearlyData.precip);
  const seasonalTemperatures = calculateSeasonalAverages(monthlyData, 'temp');
  const seasonalRainfall = calculateSeasonalAverages(monthlyData, 'precip');
  const growingDays = calculateGrowingDays(
    apiData.avg_last_frost,
    apiData.avg_first_frost
  );
  return {
    avgTemperature,
    avgRainfall,
    hardinessZone,
    koppenZone,
    ecoregion: apiData.ecoregion,
    springTemperature: seasonalTemperatures.spring,
    summerTemperature: seasonalTemperatures.summer,
    fallTemperature: seasonalTemperatures.fall,
    winterTemperature: seasonalTemperatures.winter,
    springRainfall: seasonalRainfall.spring,
    summerRainfall: seasonalRainfall.summer,
    fallRainfall: seasonalRainfall.fall,
    winterRainfall: seasonalRainfall.winter,
    growingDays,
  };
}

function calculateSeasonalAverages(
  monthlyData: Array<{ min: string; max: string; precip: string }>,
  type: 'temp' | 'precip'
): Record<string, number> {
  const seasons = [
    { name: 'winter', months: [11, 0, 1] },
    { name: 'spring', months: [2, 3, 4] },
    { name: 'summer', months: [5, 6, 7] },
    { name: 'fall', months: [8, 9, 10] },
  ];
  return seasons.reduce((acc, season) => {
    const seasonalData = season.months.map((month) => monthlyData[month]);
    const average =
      type === 'temp'
        ? seasonalData.reduce(
            (sum, month) =>
              sum + (parseFloat(month.min) + parseFloat(month.max)) / 2,
            0
          ) / 3
        : seasonalData.reduce(
            (sum, month) => sum + parseFloat(month.precip),
            0
          ) / 3;
    acc[season.name] = average;
    return acc;
  }, {} as Record<string, number>);
}

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
  const [lastFrostMonth, lastFrostDay] = lastFrost.split(' ');
  const [firstFrostMonth, firstFrostDay] = firstFrost.split(' ');
  const lastFrostDate = new Date(
    2023,
    months.indexOf(lastFrostMonth),
    parseInt(lastFrostDay)
  );
  const firstFrostDate = new Date(
    2023,
    months.indexOf(firstFrostMonth),
    parseInt(firstFrostDay)
  );
  if (firstFrostDate < lastFrostDate) {
    firstFrostDate.setFullYear(2024);
  }
  return Math.round(
    (firstFrostDate.getTime() - lastFrostDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export async function fetchClimateDataFromAPI(
  zipcode: string
): Promise<ClimateData> {
  const url = `https://climate-by-zip.p.rapidapi.com/climate/${zipcode}`;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apiKey as string,
      'x-rapidapi-host': 'climate-by-zip.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiData: ApiClimateData = await response.json();
    return parseClimateData(apiData);
  } catch (error) {
    console.error('Error fetching climate data:', error);
    throw new Error('Failed to fetch climate data');
  }
}

import { useParams, Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  Thermometer,
  Droplets,
  Calendar,
  Sprout,
  Globe,
  Home,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { GrassSpeciesWithClimate } from '../types';

export function ResultsPage() {
  const { zipcode } = useParams<{ zipcode: string }>();
  const [grassMatches, setGrassMatches] = useState<GrassSpeciesWithClimate[]>(
    []
  );
  const [expandedGrass, setExpandedGrass] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailedClimate, setShowDetailedClimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/grass-species/${zipcode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: GrassSpeciesWithClimate[] = await response.json();
        setGrassMatches(data.slice(0, 5)); // Get top 5 matches
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (zipcode) {
      fetchData();
    }
  }, [zipcode]);

  const toggleExpand = (index: number) => {
    setExpandedGrass(expandedGrass === index ? null : index);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  const climateData = grassMatches[0]?.climateData;

  return (
    <div className="py-12 sm:py-14 min-h-screen w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-8 text-center text-emerald-700 tracking-tight">
          Your Lawn Care Results for {zipcode}
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Grass Matches Section */}
          <div className="w-full lg:w-2/3">
            <h3 className="text-2xl font-semibold mb-4 text-emerald-700">
              Top Grass Matches
            </h3>
            <div className="space-y-4">
              {grassMatches.map((grass, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-semibold text-emerald-700">
                        {grass.name}
                      </span>
                      <span className="text-lg font-medium text-emerald-600">
                        {grass.match_percentage.toFixed(0)}% match
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div
                        className="bg-emerald-600 h-2.5 rounded-full"
                        style={{ width: `${grass.match_percentage}%` }}
                      />
                    </div>
                    <button
                      onClick={() => toggleExpand(index)}
                      className="text-emerald-700 hover:text-emerald-600 font-medium flex items-center">
                      {expandedGrass === index ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                      <span className="ml-2">View Details</span>
                    </button>
                    {expandedGrass === index && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700 mb-4">
                          {grass.description}
                        </p>
                        <h4 className="font-semibold mb-2 text-emerald-700">
                          Ideal Growing Conditions:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700">
                          <li>
                            Temperature: {grass.idealTempMin}°F -{' '}
                            {grass.idealTempMax}°F
                          </li>
                          <li>
                            Rainfall: {grass.idealRainfallMin}" -{' '}
                            {grass.idealRainfallMax}" per year
                          </li>
                          <li>Hardiness Zone: {grass.idealHardinessZone}</li>
                          <li>Köppen Climate Zone: {grass.idealKoppenZone}</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Climate Data Section */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-4 text-emerald-700">
                Climate Data Overview
              </h3>
              <div className="space-y-4">
                <ClimateDataItem
                  icon={<Thermometer className="text-emerald-600" size={24} />}
                  label="Average Temperature"
                  value={`${formatNumber(climateData?.avgTemperature)}°F`}
                />
                <ClimateDataItem
                  icon={<Droplets className="text-emerald-600" size={24} />}
                  label="Average Rainfall"
                  value={`${formatNumber(climateData?.avgRainfall)}" per year`}
                />
                <ClimateDataItem
                  icon={<Calendar className="text-emerald-600" size={24} />}
                  label="Growing Days"
                  value={climateData?.growingDays ?? 'N/A'}
                />
                <ClimateDataItem
                  icon={<Sprout className="text-emerald-600" size={24} />}
                  label="Hardiness Zone"
                  value={climateData?.hardinessZone ?? 'N/A'}
                />
                <ClimateDataItem
                  icon={<Globe className="text-emerald-600" size={24} />}
                  label="Köppen Climate Zone"
                  value={climateData?.koppenZone ?? 'N/A'}
                />
              </div>
              <button
                onClick={() => setShowDetailedClimate(!showDetailedClimate)}
                className="mt-4 text-emerald-700 hover:text-emerald-600 font-medium flex items-center">
                {showDetailedClimate ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
                <span className="ml-2">
                  {showDetailedClimate
                    ? 'Hide Detailed Climate Data'
                    : 'View Detailed Climate Data'}
                </span>
              </button>
              {showDetailedClimate && (
                <DetailedClimateData climateData={climateData} />
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="bg-gray-100 text-emerald-800 px-6 py-3 rounded-full text-lg font-semibold hover:bg-emerald-700 hover:text-gray-100 transition duration-300 shadow-md hover:shadow-lg flex items-center">
            <Home size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ClimateDataItem({ icon, label, value }) {
  return (
    <div className="flex items-center">
      {icon}
      <div className="ml-3">
        <p className="font-medium text-gray-700">{label}</p>
        <p className="text-emerald-600">{value}</p>
      </div>
    </div>
  );
}

function DetailedClimateData({ climateData }) {
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

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="font-semibold mb-2 text-emerald-700">
        Monthly Temperature & Rainfall
      </h4>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month) => (
          <div key={month} className="text-sm">
            <p className="font-bold text-gray-600">{month}</p>
            <p className="text-emerald-600">
              {formatNumber(climateData?.monthlyTemperature[month])}°F
            </p>
            <p className="text-blue-500">
              {formatNumber(climateData?.monthlyRainfall[month])}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const formatNumber = (value: string | number | undefined): string => {
  if (value === undefined) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 'N/A' : num.toFixed(1);
};

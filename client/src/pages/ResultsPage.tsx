import { useParams } from 'react-router-dom';
import {
  Leaf,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Droplets,
  Calendar,
  Sprout,
  Globe,
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
  const [showMonthlyTemp, setShowMonthlyTemp] = useState(false);
  const [showMonthlyPrecip, setShowMonthlyPrecip] = useState(false);

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
        console.log('Received data:', data); // Debugging line
        if (data.length === 0) {
          setError('No grass species found for this zipcode.');
        } else {
          setGrassMatches(data);
        }
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

  if (grassMatches.length === 0) {
    return (
      <div className="text-center py-12">
        No grass species found for this zipcode.
      </div>
    );
  }

  const climateData = grassMatches[0]?.climateData;
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
  const hasMonthlyData =
    climateData?.monthlyTemperature && climateData?.monthlyRainfall;

  return (
    <div className="bg-white bg-opacity-85 py-12 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-3xl font-semibold mb-8 px-4 sm:px-0 sm:text-center text-green-800 tracking-tight">
          Your Lawn Care Results
        </h2>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <div className="w-full lg:w-2/3 order-2 lg:order-1 flex flex-col h-full">
            <div className="space-y-6 flex-1">
              {grassMatches.map((grass, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <div className="p-6">
                    <div
                      className="cursor-pointer"
                      onClick={() => toggleExpand(index)}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-semibold">
                          {grass.name}
                        </span>
                        <div className="flex items-center">
                          <Leaf className="text-green-600 mr-2" size={24} />
                          {expandedGrass === index ? (
                            <ChevronUp className="text-gray-600" size={24} />
                          ) : (
                            <ChevronDown className="text-gray-600" size={24} />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${grass.match_percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {grass.match_percentage.toFixed(0)}% match
                        </span>
                      </div>
                    </div>
                    {expandedGrass === index && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-700 mb-4">
                          {grass.description}
                        </p>
                        <h4 className="font-semibold mb-2">
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

          <div className="w-full lg:w-1/3 order-1 lg:order-2 mb-8 lg:mb-0 flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-md p-6 flex-1">
              <h3 className="text-2xl font-semibold mb-4 text-green-800 tracking-tight">
                Climate Data for {`${zipcode}`}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Thermometer className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">
                      Average Temperature
                    </p>
                    <p>{formatNumber(climateData?.avgTemperature)}°F</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Droplets className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">
                      Average Rainfall
                    </p>
                    <p className="text-gray-700">
                      {formatNumber(climateData?.avgRainfall)}" per year
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Growing Days</p>
                    <p>{climateData?.growingDays ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-700">
                  <Sprout className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">Hardiness Zone</p>
                    <p>{climateData?.hardinessZone ?? 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Globe className="text-blue-500 mr-3" size={24} />
                  <div>
                    <p className="font-medium text-gray-700">
                      Köppen Climate Zone
                    </p>
                    <p className="text-gray-700">
                      {climateData?.koppenZone ?? 'N/A'}
                    </p>
                  </div>
                </div>
                {hasMonthlyData && (
                  <>
                    <div>
                      <button
                        onClick={() => setShowMonthlyTemp(!showMonthlyTemp)}
                        className="text-blue-700 hover:text-blue-500 font-medium flex items-center">
                        {showMonthlyTemp ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                        <span className="ml-2">Monthly Temp Averages</span>
                      </button>
                      {showMonthlyTemp && (
                        <div className="mt-2 pl-6 grid grid-cols-3 gap-2">
                          {months.map((month) => (
                            <p key={month} className="font-bold text-gray-600">
                              {month}:{' '}
                              <span className="font-medium text-orange-400">
                                {formatNumber(
                                  climateData.monthlyTemperature[month]
                                )}
                                °F
                              </span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <button
                        onClick={() => setShowMonthlyPrecip(!showMonthlyPrecip)}
                        className="text-blue-700 hover:text-blue-500 font-medium flex items-center">
                        {showMonthlyPrecip ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                        <span className="ml-2">Monthly Rainfall Averages</span>
                      </button>
                      {showMonthlyPrecip && (
                        <div className="mt-2 pl-6 grid grid-cols-3 gap-2">
                          {months.map((month) => (
                            <p
                              key={month}
                              className="font-semibold text-gray-600">
                              {month}:{' '}
                              <span className="font-medium text-blue-400">
                                {formatNumber(
                                  climateData.monthlyRainfall[month]
                                )}
                                "
                              </span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="bg-green-600 text-white px-8 py-3 rounded text-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md hover:shadow-lg">
            Create Your Lawn Care Plan
          </button>
        </div>
      </div>
    </div>
  );
}

const formatNumber = (value: string | number | undefined): string => {
  if (value === undefined) return 'N/A';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? 'N/A' : num.toFixed(1);
};

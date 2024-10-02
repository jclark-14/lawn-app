import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { ArrowLeft, SquarePlus } from 'lucide-react';

export function NewPlan() {
  const [grassSpecies, setGrassSpecies] = useState('');
  const [planType, setPlanType] = useState('');
  const [establishmentType, setEstablishmentType] = useState('');
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const { user, token } = useUser();

  useEffect(() => {
    if (grassSpecies && planType === 'new_lawn') {
      const fetchAvailableLawnTypes = async () => {
        try {
          const response = await fetch(
            `/api/grass-species/${grassSpecies}/plan-types`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error('Failed to fetch lawn types');
          }
          const data = await response.json();

          const availableTypes = data
            .filter((item) => item.planType === 'new_lawn')
            .map((item) => item.establishmentType)
            .filter(Boolean);

          setAvailableTypes(availableTypes);
          console.log('Available types:', availableTypes);
        } catch (err) {
          console.error('Error fetching lawn types:', err);
          setError('Failed to load lawn types. Please try again.');
        }
      };
      fetchAvailableLawnTypes();
    } else {
      setEstablishmentType('');
    }
  }, [grassSpecies, planType, token]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) {
        console.log('Submission already in progress, ignoring');
        return;
      }
      if (!user) {
        setError('You must be logged in to create a plan');
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/plans/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            grassSpeciesId: grassSpecies,
            planType,
            establishmentType,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create plan');
        }

        const data = await response.json();
        console.log('Plan created successfully:', data);
        navigate(`/plan/${data.userPlanId}`);
      } catch (err) {
        console.error('Error creating plan:', err);
        setError(
          'An error occurred while creating the plan. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      user,
      grassSpecies,
      planType,
      establishmentType,
      navigate,
      isLoading,
      token,
    ]
  );

  const zipcode = localStorage.getItem('zipcode');

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="py-12 sm:pb-20 sm:pt-24 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <div className="flex justify-between items-center mb-10">
          <div className="flex justify-center">
            <Link
              to={zipcode ? `/results/${zipcode}` : '/'}
              className="bg-gray-100 text-emerald-800 px-6 py-4 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-emerald-700 to-teal-600 hover:text-white hover:border-emerald-600">
              <ArrowLeft size={20} className="mr-2" />
              {zipcode ? 'Back to Search Results' : 'Back to Home'}
            </Link>
          </div>
        </div>

        <div className="bg-emerald-900 bg-opacity-70 rounded-lg shadow-lg p-8">
          <h2 className="text-3xl text-gray-50 sm:text-4xl font-bold text-center tracking-tight mb-8">
            Create a Lawn Plan
          </h2>
          {error && <p className="text-red-500 mb-5 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="grassSpecies"
                className="block mb-2 font-semibold text-gray-50 mt-4">
                Grass Species
              </label>
              <select
                id="grassSpecies"
                value={grassSpecies}
                onChange={(e) => setGrassSpecies(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select a grass species</option>
                <option value="1">Kentucky Bluegrass</option>
                <option value="2">Tall Fescue</option>
                <option value="3">Perennial Ryegrass</option>
                <option value="4">Bermuda</option>
                <option value="5">Zoysia</option>
                <option value="6">St. Augustine</option>
                <option value="7">Centipede</option>
                <option value="8">Fine Fescue</option>
                <option value="9">Buffalo</option>
                <option value="10">Bahia</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="planType"
                className="block mb-2 font-semibold text-gray-50 mt-4">
                Plan Type
              </label>
              <select
                id="planType"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select a plan type</option>
                <option value="new_lawn">New Lawn</option>
                <option value="lawn_improvement">Lawn Improvement</option>
              </select>
            </div>
            {planType === 'new_lawn' && (
              <div>
                <label
                  htmlFor="lawnType"
                  className="block mb-2 font-semibold text-gray-50 mt-4">
                  Lawn Establishment Type
                </label>
                <select
                  id="lawnType"
                  value={establishmentType}
                  onChange={(e) => setEstablishmentType(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option value="">Select a lawn type</option>
                  {availableTypes.map((type: string) => (
                    <option key={type} value={type}>
                      {type === 'sod_plugs'
                        ? 'Sod or Plugs'
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 border border-solid border-teal-800 bg-opacity-80 text-gray-50 p-3 rounded-full mt-10 transition duration-300 hover:font-semibold hover:bg-gradient-to-r from-emerald-800 to-teal-700 hover:border-emerald-600 hover:shadow-xl flex items-center justify-center">
              <SquarePlus size={24} className="mr-2" />
              {isLoading ? 'Creating Plan...' : 'Create Plan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

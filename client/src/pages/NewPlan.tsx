import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

export function NewPlan() {
  const [grassSpecies, setGrassSpecies] = useState('');
  const [planType, setPlanType] = useState('');
  const [lawnType, setLawnType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useUser();

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

      console.log('Submitting new plan:', { grassSpecies, planType, lawnType });

      try {
        const response = await fetch('/api/plans/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.userId,
            grassSpecies,
            planType,
            lawnType,
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
    [user, grassSpecies, planType, lawnType, navigate, isLoading]
  );

  return (
    <div className="py-12 sm:pb-20 sm:pt-32 w-full">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-md rounded-lg shadow-lg bg-green-900 bg-opacity-70">
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
                Lawn Type
              </label>
              <select
                id="lawnType"
                value={lawnType}
                onChange={(e) => setLawnType(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                <option value="">Select a lawn type</option>
                <option value="seed">Seed</option>
                <option value="sod">Sod</option>
                <option value="plug">Plug</option>
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 bg-opacity-80 text-gray-50 p-2 rounded mt-10 transition duration-300 hover:font-semibold hover:bg-gradient-to-r from-emerald-900 to-emerald-600  hover:border-emerald-600 hover:shadow-xl">
            {isLoading ? 'Creating Plan...' : 'Create Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}

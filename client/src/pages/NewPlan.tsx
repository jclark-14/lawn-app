import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { ArrowLeft, SquarePlus } from 'lucide-react';
import { PlanDetailsSkeleton } from '../components/Skeleton';

// Main NewPlan component
export function NewPlan() {
  // State management for form data, available lawn types, loading state, and errors
  const [formData, setFormData] = useState({
    grassSpecies: '',
    planType: '',
    establishmentType: '',
  });
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  // Hooks for navigation and user authentication
  const navigate = useNavigate();
  const { user, token } = useUser();

  // Function to fetch available lawn types based on selected grass species
  useEffect(() => {
    async function fetchAvailableEstablishmentTypes() {
      // Only fetch if necessary conditions are met
      if (
        !formData.grassSpecies ||
        formData.planType !== 'new_lawn' ||
        !token
      ) {
        return;
      }

      try {
        // API call to get available lawn types
        const response = await fetch(
          `/api/grass-species/${formData.grassSpecies}/plan-types`,
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

        // Filter and set available establishment types
        const availableTypes = data
          .filter((item) => item.planType === 'new_lawn')
          .map((item) => item.establishmentType)
          .filter(Boolean);

        setAvailableTypes(availableTypes);
      } catch (err) {
        console.error('Error fetching lawn types:', err);
        setError('Failed to load lawn types. Please try again.');
      }
    }
    fetchAvailableEstablishmentTypes();
  }, [formData.grassSpecies, formData.planType, token]);

  // Function to handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading || !user) {
        setError('You must be logged in to create a plan');
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        // API call to create a new plan
        const response = await fetch('/api/plans/new', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            grassSpeciesId: formData.grassSpecies,
            planType: formData.planType,
            establishmentType: formData.establishmentType,
          }),
        });
        if (!response.ok) {
          throw new Error('Failed to create plan');
        }

        const data = await response.json();
        // Navigate to the newly created plan
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
    [user, formData, navigate, isLoading, token]
  );

  // Function to handle input changes in the form
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Retrieve zipcode from local storage
  const zipcode = localStorage.getItem('zipcode');

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return <PlanDetailsSkeleton />;
  }

  // Render the main component
  return (
    <div className="py-12 sm:pb-18 sm:pt-18 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        <BackButton zipcode={zipcode} />
        <PlanForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          availableTypes={availableTypes}
          error={error}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// Back Button component for navigation
function BackButton({ zipcode }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex justify-center">
        <Link
          to={zipcode ? `/results/${zipcode}` : '/'}
          className="bg-gray-100 text-teal-800 px-6 py-4 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:text-white hover:border-teal-600">
          <ArrowLeft size={20} className="mr-2" />
          {zipcode ? 'Climate Results' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
}

// Plan Form component for creating a new lawn plan
function PlanForm({
  formData,
  handleInputChange,
  handleSubmit,
  availableTypes,
  error,
  isLoading,
}) {
  return (
    <div className="bg-teal-900 bg-opacity-70 rounded-lg shadow-lg p-8">
      <h2 className="text-3xl text-gray-50 sm:text-4xl font-bold text-center tracking-tight mb-8">
        Create a Lawn Plan
      </h2>
      {error && <p className="text-red-500 mb-5 text-center">{error}</p>}
      <form onSubmit={handleSubmit}>
        <SelectField
          id="grassSpecies"
          label="Grass Species"
          value={formData.grassSpecies}
          onChange={handleInputChange}
          options={[
            { value: '1', label: 'Kentucky Bluegrass' },
            { value: '2', label: 'Tall Fescue' },
            { value: '3', label: 'Perennial Ryegrass' },
            { value: '4', label: 'Bermuda' },
            { value: '5', label: 'Zoysia' },
            { value: '6', label: 'St. Augustine' },
            { value: '7', label: 'Centipede' },
            { value: '8', label: 'Fine Fescue' },
            { value: '9', label: 'Buffalo' },
            { value: '10', label: 'Bahia' },
          ]}
        />
        <SelectField
          id="planType"
          label="Plan Type"
          value={formData.planType}
          onChange={handleInputChange}
          options={[
            { value: 'new_lawn', label: 'New Lawn' },
            { value: 'lawn_improvement', label: 'Lawn Improvement' },
          ]}
        />
        {formData.planType === 'new_lawn' && (
          <SelectField
            id="establishmentType"
            label="Lawn Establishment Type"
            value={formData.establishmentType}
            onChange={handleInputChange}
            options={availableTypes.map((type) => ({
              value: type,
              label:
                type === 'sod_plugs'
                  ? 'Sod or Plugs'
                  : type.charAt(0).toUpperCase() + type.slice(1),
            }))}
          />
        )}
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
}

// Reusable Select Field component
function SelectField({ id, label, value, onChange, options }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 font-semibold text-gray-50 mt-4">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
        <option value="">Select a {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Submit Button component
function SubmitButton({ isLoading }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-teal-600 border border-solid border-teal-800 bg-opacity-80 text-gray-50 p-3 rounded-full mt-10 transition duration-300 hover:font-semibold hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:border-teal-700 hover:shadow-xl flex items-center justify-center">
      <SquarePlus size={24} className="mr-2" />
      {isLoading ? 'Creating Plan...' : 'Create Plan'}
    </button>
  );
}

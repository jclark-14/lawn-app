import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { ArrowLeft, SquarePlus } from 'lucide-react';
import { NewPlanSkeleton } from '../components/Skeleton';
import { useFetchLawnTypes } from '../hooks/useFetchLawnTypes';
import { useCreatePlan } from '../hooks/useCreatePlan';

export function NewPlan() {
  const [formData, setFormData] = useState({
    grassSpecies: '',
    planType: '',
    establishmentType: '',
  });
  const navigate = useNavigate();
  const { user } = useUser();

  const zipcode = localStorage.getItem('zipcode');

  // Fetch available lawn establishment types based on form data
  const { availableTypes, error: lawnTypesError } = useFetchLawnTypes(formData);

  // Custom hook to handle creating a new lawn care plan
  const { createPlan, isLoading, error: createPlanError } = useCreatePlan();

  // Handle form input changes and update form state
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create a new plan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    // Create a new plan using the user ID and form data
    const result = await createPlan(user.userId, formData);
    if (result) {
      // Navigate to the plan page if the creation was successful
      navigate(`/plan/${result.userPlanId}`);
    }
  };

  // Show a loading skeleton while the plan is being created
  if (isLoading) {
    return <NewPlanSkeleton />;
  }

  return (
    <div className="py-12 sm:pb-18 sm:pt-18 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-lg">
        {/* Back button for navigating to previous or home page */}
        <BackButton zipcode={zipcode} />

        {/* Plan form with data inputs and submission handling */}
        <PlanForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          availableTypes={availableTypes}
          error={lawnTypesError || createPlanError}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// Component to display a back button, dynamically linking to climate results or home
function BackButton({ zipcode }: { zipcode: string | null }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <Link
        to={zipcode ? `/results/${zipcode}` : '/'}
        className="bg-gray-100 text-teal-800 px-6 py-4 rounded-full text-md font-semibold transition duration-300 shadow-md hover:shadow-xl flex items-center hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:text-white hover:border-teal-600">
        <ArrowLeft size={20} className="mr-2" />
        {zipcode ? 'Climate Results' : 'Back to Home'}
      </Link>
    </div>
  );
}

// Form component for creating a new lawn care plan
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
      {/* Display error message if there are any errors during plan creation */}
      {error && <p className="text-red-500 mb-5 text-center">{error}</p>}

      {/* Plan form submission */}
      <form onSubmit={handleSubmit}>
        {/* Select field for choosing grass species */}
        <SelectField
          id="grassSpecies"
          label="Grass Species"
          value={formData.grassSpecies}
          onChange={handleInputChange}
          options={grassSpeciesOptions}
        />

        {/* Select field for choosing plan type */}
        <SelectField
          id="planType"
          label="Plan Type"
          value={formData.planType}
          onChange={handleInputChange}
          options={planTypeOptions}
        />

        {/* Conditionally render the establishment type field if 'new_lawn' is selected */}
        {formData.planType === 'new_lawn' && (
          <SelectField
            id="establishmentType"
            label="Lawn Establishment Type"
            value={formData.establishmentType}
            onChange={handleInputChange}
            options={availableTypes.map(formatEstablishmentType)}
          />
        )}

        {/* Submission button to create the plan */}
        <SubmitButton isLoading={isLoading} />
      </form>
    </div>
  );
}

// Reusable select field component for dropdown menus
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

// Button component for form submission, includes loading state handling
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-teal-600 border border-solid border-teal-800 bg-opacity-80 text-gray-50 p-3 rounded-full mt-10 transition duration-300 hover:font-semibold hover:bg-gradient-to-r from-gray-800 to-teal-500 hover:border-teal-700 hover:shadow-xl flex items-center justify-center">
      <SquarePlus size={24} className="mr-2" />
      {/* Update button text based on loading state */}
      {isLoading ? 'Creating Plan...' : 'Create Plan'}
    </button>
  );
}

// Options for grass species in the dropdown menu
const grassSpeciesOptions = [
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
];

// Options for different lawn plan types
const planTypeOptions = [
  { value: 'new_lawn', label: 'New Lawn' },
  { value: 'lawn_improvement', label: 'Lawn Improvement' },
];

// Format function to adjust the display label for lawn establishment types
const formatEstablishmentType = (type) => ({
  value: type,
  label:
    type === 'sod_plugs'
      ? 'Sod or Plugs'
      : type.charAt(0).toUpperCase() + type.slice(1),
});

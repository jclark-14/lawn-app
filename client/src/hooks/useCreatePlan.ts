import { useState } from 'react';
import { useUser } from './useUser';

// Interface to define the structure of the plan data
interface PlanData {
  grassSpecies: string;
  planType: string;
  establishmentType: string;
}

// Interface to define the expected result after successfully creating a plan
interface CreatePlanResult {
  userPlanId: number;
}

// Custom hook to manage the creation of a new lawn care plan
export function useCreatePlan() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hook to retrieve the authentication token from the user context
  const { token } = useUser();

  // Function to create a new plan by making an API request
  const createPlan = async (
    userId: number, // User ID to associate the plan with the logged-in user
    planData: PlanData // Plan details provided by the user
  ): Promise<CreatePlanResult | null> => {
    // Prevent multiple requests if a plan creation is already in progress
    if (isLoading) {
      return null;
    }

    // Set loading state to true and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      // Send a POST request to the backend to create a new plan
      const response = await fetch('/api/plans/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the user's token for authentication
        },
        body: JSON.stringify({
          userId,
          grassSpeciesId: planData.grassSpecies, // Convert grass species to ID
          planType: planData.planType,
          establishmentType: planData.establishmentType,
        }),
      });

      // If the response is not successful, throw an error
      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      // Parse the JSON response to extract the new plan's details
      const data = await response.json();
      return data;
    } catch (err) {
      // Handle any errors that occur during the API request
      console.error('Error creating plan:', err);
      setError('An error occurred while creating the plan. Please try again.');
      return null;
    } finally {
      // Reset the loading state after the request is complete
      setIsLoading(false);
    }
  };

  // Return the createPlan function, along with the loading and error states, to be used in components
  return { createPlan, isLoading, error };
}

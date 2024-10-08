import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser'; // Custom hook to fetch user data, specifically the authentication token
import { UserPlan } from '../types'; // Type for the plan object structure

// Custom hook for fetching a plan based on the provided planId
export function useFetchPlan(planId: string | undefined) {
  const [plan, setPlan] = useState<UserPlan | null>(null); // State to store the fetched plan or null if not fetched
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to handle any errors during the fetch
  const { token } = useUser(); // Destructure the authentication token from the useUser hook

  // Fetch plan data from the API
  const fetchPlan = useCallback(async () => {
    if (!token || !planId) {
      // If there's no token or planId, stop loading and exit early
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send the fetch request to the API using the planId and authentication token
      const response = await fetch(`/api/plans/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error('Failed to fetch plan');
      }

      const data: UserPlan = await response.json(); // Parse the response data as JSON

      // Sort the steps in the plan by their stepOrder value, with null or undefined orders pushed to the end
      data.steps.sort(
        (a, b) => (a.stepOrder ?? Infinity) - (b.stepOrder ?? Infinity)
      );

      setPlan(data); // Set the plan data in state
    } catch (err) {
      console.error('Error fetching plan:', err);
      setError('Failed to load plan. Please try again.'); // Set an error message in state for the UI to display
    } finally {
      setIsLoading(false);
    }
  }, [planId, token]);

  // useEffect to automatically fetch the plan when the hook is used or when planId/token changes
  useEffect(() => {
    fetchPlan(); // Invoke the fetchPlan function
  }, [fetchPlan]); // Dependencies: This effect runs when fetchPlan changes

  // Return the plan data, loading status, error state, and a function to manually refetch the plan
  return { plan, isLoading, error, refetchPlan: fetchPlan };
}

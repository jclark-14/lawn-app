import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser'; // Custom hook to access user and token information
import { UserPlan, PlanStep } from '../types'; // Types for UserPlan and PlanStep

// Custom hook to fetch and manage the user's lawn care plans
export function useFetchUserPlans() {
  const [plans, setPlans] = useState<UserPlan[]>([]); // State to store fetched plans
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track any errors during the fetch
  const { user, token } = useUser(); // Destructure user and token from the custom useUser hook

  // Function to sort plan steps by their stepOrder property
  const sortSteps = (steps: PlanStep[]): PlanStep[] => {
    return [...steps].sort(
      (a, b) => (a.stepOrder ?? Infinity) - (b.stepOrder ?? Infinity)
    );
  };

  // Function to fetch the user's plans from the API
  const fetchPlans = useCallback(async () => {
    // Exit if the user is not logged in or there is no token
    if (!user || !token) return;

    setIsLoading(true);

    try {
      // Make a GET request to fetch the user's plans
      const response = await fetch(`/api/users/${user.userId}/plans`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the user's token for authorization
        },
      });

      if (!response.ok) throw new Error('Failed to fetch plans'); // Throw an error if the response is not OK

      const data = await response.json(); // Parse the response data as JSON

      // Set the plans in state, sorting the steps for each plan
      setPlans(
        data.map((plan: UserPlan) => ({
          ...plan,
          steps: sortSteps(plan.steps), // Sort steps in each plan by stepOrder
        }))
      );
    } catch (err) {
      setError('Error fetching plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user, token]); // Dependencies: fetchPlans will be recreated if user or token changes

  // useEffect to automatically fetch plans when the component mounts or fetchPlans changes
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]); // Dependencies: re-fetch plans if fetchPlans changes

  // Return the plans, loading state, error state, and a function to refetch the plans
  return { plans, isLoading, error, refetchPlans: fetchPlans };
}

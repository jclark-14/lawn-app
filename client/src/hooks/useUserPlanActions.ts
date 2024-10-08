import { useCallback } from 'react';
import { useUser } from './useUser'; // Custom hook to access user information, including the authentication token

// Custom hook that provides actions to manage user plans (delete, complete plans, complete steps)
export function useUserPlanActions(refetchPlans: () => Promise<void>) {
  const { token } = useUser(); // Retrieve the user's authentication token from the useUser hook

  // Function to delete a user plan
  const deletePlan = useCallback(
    async (planId: number) => {
      if (!token) return; // If no token, exit early

      try {
        // Send DELETE request to remove the plan
        const response = await fetch(`/api/plans/${planId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // Include the user's token in the request headers
          },
        });

        if (!response.ok) throw new Error('Failed to delete plan'); // Throw an error if the request fails

        await refetchPlans(); // Refetch the plans after successful deletion
      } catch (err) {
        console.error('Error deleting plan:', err); // Log any errors to the console
      }
    },
    [token, refetchPlans] // Dependencies: the token and the refetchPlans function
  );

  // Function to mark a plan as completed
  const completePlan = useCallback(
    async (planId: number) => {
      if (!token) return; // If no token, exit early

      try {
        const completedAt = new Date().toISOString(); // Set the completion time to the current date/time
        // Send PUT request to update the plan as completed
        const response = await fetch(`/api/plans/${planId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Specify the request content type
            Authorization: `Bearer ${token}`, // Include the user's token in the request headers
          },
          body: JSON.stringify({ completedAt }), // Send the completion date in the request body
        });

        if (!response.ok) throw new Error('Failed to complete plan'); // Throw an error if the request fails

        await refetchPlans(); // Refetch the plans after successful completion
      } catch (err) {
        console.error('Error completing plan:', err); // Log any errors to the console
      }
    },
    [token, refetchPlans] // Dependencies: the token and the refetchPlans function
  );

  // Function to mark specific steps in a plan as completed
  const completeSteps = useCallback(
    async (planId: number, stepIds: number[]) => {
      if (!token) return; // If no token, exit early

      try {
        // Send PUT request to update specific steps in the plan as completed
        const response = await fetch(`/api/plans/${planId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Specify the request content type
            Authorization: `Bearer ${token}`, // Include the user's token in the request headers
          },
          body: JSON.stringify({ stepIds }), // Send the array of step IDs in the request body
        });

        if (!response.ok) {
          const errorData = await response.json(); // If the request fails, get error details from the response
          throw new Error(errorData.message || 'Failed to complete steps'); // Throw an error with a custom message if available
        }

        await refetchPlans(); // Refetch the plans after successfully completing the steps
      } catch (err) {
        console.error('Error completing steps:', err); // Log any errors to the console
      }
    },
    [token, refetchPlans] // Dependencies: the token and the refetchPlans function
  );

  // Return the actions (deletePlan, completePlan, completeSteps) for managing user plans
  return { deletePlan, completePlan, completeSteps };
}

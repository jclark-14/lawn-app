import { useState } from 'react';
import { useUser } from './useUser'; // Custom hook to retrieve user and token
import { UserPlan } from '../types'; // Type for user plans

// Custom hook for updating an existing plan
export function useUpdatePlan(
  planId: string | undefined, // The ID of the plan to update
  refetchPlan: () => Promise<void> // Function to refetch the plan data after operations
) {
  const [isSaving, setIsSaving] = useState(false); // State to track if the plan is currently being saved
  const { token } = useUser(); // Retrieve the user's authentication token from the useUser hook

  // Function to update the plan with new data
  const updatePlan = async (updatedPlan: UserPlan) => {
    if (!token || !planId) {
      console.error('Missing token or planId'); // Log an error if token or planId is not available
      return;
    }

    setIsSaving(true); // Set the saving state to true while the request is in progress
    try {
      // Send a PUT request to update the plan
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Set the request content type to JSON
          Authorization: `Bearer ${token}`, // Include the token for authentication
        },
        body: JSON.stringify(updatedPlan), // Send the updated plan data as JSON
      });

      if (!response.ok) {
        // If the response status is not OK, throw an error
        throw new Error('Failed to save plan');
      }

      await refetchPlan(); // Refetch the plan data after successfully updating it
    } catch (err) {
      console.error('Error updating plan:', err); // Log any errors to the console
      throw new Error('Failed to save plan. Please try again.'); // Rethrow the error for UI-level handling
    } finally {
      setIsSaving(false); // Reset the saving state to false after the request is finished
    }
  };

  // Return the updatePlan function and the isSaving state for use in components
  return { updatePlan, isSaving };
}

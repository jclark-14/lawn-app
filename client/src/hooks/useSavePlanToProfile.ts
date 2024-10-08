import { useState } from 'react';
import { useUser } from './useUser'; // Custom hook to retrieve user and token data

// Custom hook for saving a plan to the user's profile
export function useSavePlanToProfile() {
  const [isSaving, setIsSaving] = useState(false); // State to track whether the plan is being saved
  const { user, token } = useUser(); // Destructure the user and token from the useUser hook

  // Function to save a plan to the user's profile
  const savePlanToProfile = async (planId: number) => {
    // Ensure the user is authenticated before attempting to save
    if (!user || !token) {
      console.error('User not authenticated'); // Log error if no user or token
      return false; // Return false to indicate the save was not successful
    }

    setIsSaving(true); // Set the saving state to true when the request starts
    try {
      // Send a POST request to save the plan to the user's profile
      const response = await fetch(`/api/users/${user.userId}/plans`, {
        method: 'POST', // Use the POST method to add the plan to the user's profile
        headers: {
          'Content-Type': 'application/json', // Set the request body content type to JSON
          Authorization: `Bearer ${token}`, // Include the user's token in the Authorization header
        },
        body: JSON.stringify({ planId }), // Send the planId in the request body
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error('Failed to save plan to profile');
      }

      return true; // Return true to indicate the plan was successfully saved
    } catch (err) {
      console.error('Error saving plan to profile:', err); // Log any error to the console for debugging
      throw new Error('Failed to save plan to profile. Please try again.'); // Throw a new error for UI-level error handling
    } finally {
      setIsSaving(false); // Set the saving state to false once the request is complete, whether successful or not
    }
  };

  // Return the savePlanToProfile function and isSaving state to the component that uses this hook
  return { savePlanToProfile, isSaving };
}

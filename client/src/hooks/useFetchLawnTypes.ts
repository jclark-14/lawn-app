import { useState, useEffect } from 'react';
import { useUser } from './useUser';

// Interface to define the structure of the form data
interface FormData {
  grassSpecies: string;
  planType: string;
}

// Custom hook to fetch available lawn establishment types based on grass species and plan type
export function useFetchLawnTypes(formData: FormData) {
  // State to hold the list of available lawn establishment types
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Custom hook to retrieve the user's authentication token
  const { token } = useUser();

  // Effect hook that runs whenever the grass species or plan type changes
  useEffect(() => {
    // Function to fetch lawn types based on the selected grass species
    async function fetchLawnTypes() {
      // Return if the required data is missing or if the plan type is not 'new_lawn'
      if (
        !formData.grassSpecies || // Ensure grass species is selected
        formData.planType !== 'new_lawn' || // Only fetch for 'new_lawn' plan type
        !token // Ensure the user is authenticated
      ) {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Send a GET request to fetch available lawn types for the selected grass species
        const response = await fetch(
          `/api/grass-species/${formData.grassSpecies}/plan-types`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Throw an error if the response is not successful
        if (!response.ok) {
          throw new Error('Failed to fetch lawn types');
        }

        // Parse the response JSON to extract the relevant data
        const data = await response.json();

        // Filter and map the response to get the list of valid establishment types
        const newAvailableTypes = data
          .filter((item) => item.planType === 'new_lawn') // Only include 'new_lawn' types
          .map((item) => item.establishmentType) // Extract the establishment type
          .filter(Boolean); // Filter out any falsy values

        // Update the state with the newly fetched available types
        setAvailableTypes(newAvailableTypes);
      } catch (err) {
        // Handle any errors encountered during the API request
        console.error('Error fetching lawn types:', err);
        setError('Failed to load lawn types. Please try again.');
      } finally {
        // Reset the loading state after the request is complete
        setIsLoading(false);
      }
    }

    // Invoke the function to fetch lawn types
    fetchLawnTypes();
  }, [formData.grassSpecies, formData.planType, token]); // Dependencies ensure the effect runs when these values change

  // Return the available types, loading state, and any error for use in components
  return { availableTypes, isLoading, error };
}

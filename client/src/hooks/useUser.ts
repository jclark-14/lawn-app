import { useContext } from 'react';
import { UserContext, UserContextValues } from '../components/UserContext'; // Import the context and its associated types

// Re-export the User type from UserContext
export type { User } from '../components/UserContext';

/**
 * Custom hook to access the UserContext values
 * @throws {Error} If used outside of a UserProvider
 * @returns {UserContextValues} The user context values
 */
export function useUser(): UserContextValues {
  // Retrieve the context values using useContext hook
  const values = useContext(UserContext);

  // If useUser is called outside of a UserProvider, throw an error
  if (values === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  // Return the user context values if available
  return values;
}

import { useContext } from 'react';
import { UserContext, UserContextValues } from './UserContext';

// Re-export the User type from UserContext
export type { User } from './UserContext';

/**
 * Custom hook to access the UserContext values
 * @throws {Error} If used outside of a UserProvider
 * @returns {UserContextValues} The user context values
 */
export function useUser(): UserContextValues {
  const values = useContext(UserContext);

  if (values === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return values;
}

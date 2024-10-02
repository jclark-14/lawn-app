import { ReactNode, createContext, useEffect, useState } from 'react';
import { readToken, readUser, removeAuth, saveAuth } from '../lib/data';

// Type definition for User
export type User = {
  userId: number;
  username: string;
};

// Type definition for the values provided by UserContext
export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};

// Create the UserContext with default values
export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

// Props type for UserProvider
type Props = {
  children: ReactNode;
};

/**
 * UserProvider component
 * Manages user authentication state and provides it to child components
 */
export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [token, setToken] = useState<string | undefined>(undefined);

  // Effect to load user data from storage on component mount
  useEffect(() => {
    const storedUser = readUser();
    const storedToken = readToken();

    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []);

  /**
   * Handles user sign-in
   * @param user - The user object
   * @param token - The authentication token
   */
  function handleSignIn(user: User, token: string) {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }

  /**
   * Handles user sign-out
   */
  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }

  // Create the context value object
  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

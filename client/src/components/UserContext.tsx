import { ReactNode, createContext, useEffect, useState } from 'react';
import { readToken, readUser, removeAuth, saveAuth } from '../lib/data'; // Import helper functions for managing auth data

// Type definition for User
export type User = {
  userId: number; // Unique identifier for the user
  username: string; // Username of the user
};

// Type definition for the values provided by UserContext
export type UserContextValues = {
  user: User | undefined; // Current authenticated user or undefined if not logged in
  token: string | undefined; // Authentication token or undefined if not logged in
  handleSignIn: (user: User, token: string) => void; // Function to handle user sign-in
  handleSignOut: () => void; // Function to handle user sign-out
};

// Create the UserContext with default values
export const UserContext = createContext<UserContextValues>({
  user: undefined, // Default value: no user
  token: undefined, // Default value: no token
  handleSignIn: () => undefined, // Default sign-in function
  handleSignOut: () => undefined, // Default sign-out function
});

// Props type for UserProvider
type Props = {
  children: ReactNode; // Child components that will consume the context
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
    const storedUser = readUser(); // Retrieve user data from storage
    const storedToken = readToken(); // Retrieve token from storage

    // If both user and token are found in storage, set them in state
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
  }, []); // This effect runs once when the component mounts

  /**
   * Handles user sign-in
   * @param user - The user object
   * @param token - The authentication token
   */
  function handleSignIn(user: User, token: string) {
    setUser(user); // Update the state with the signed-in user
    setToken(token); // Update the state with the provided token
    saveAuth(user, token); // Save the user and token to storage (e.g., localStorage)
  }

  /**
   * Handles user sign-out
   * Clears user and token from state and storage
   */
  function handleSignOut() {
    setUser(undefined); // Clear the user state
    setToken(undefined); // Clear the token state
    removeAuth(); // Remove the user and token from storage
  }

  // Create the context value object to be provided to children
  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    // Provide the context value to all children of UserProvider
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

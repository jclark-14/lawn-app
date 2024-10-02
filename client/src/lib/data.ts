import { User } from '../components/UserContext';

// Key for storing authentication data in localStorage
const authKey = 'um.auth';

// Type definition for authentication data
type Auth = {
  user: User;
  token: string;
};

/**
 * Saves user authentication data to localStorage
 * @param user - The user object
 * @param token - The authentication token
 */
export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

/**
 * Removes authentication data from localStorage
 */
export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

/**
 * Retrieves the user object from localStorage
 * @returns The User object if found, undefined otherwise
 */
export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

/**
 * Retrieves the authentication token from localStorage
 * @returns The token string if found, undefined otherwise
 */
export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

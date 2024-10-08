import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, useUser } from '../hooks/useUser'; // Import custom hook and user type

// Type definition for authentication data (user and token)
type AuthData = {
  user: User;
  token: string;
};

// Main SignInPage component
export function SignInPage(): JSX.Element {
  // Local state for form data, initialized with empty username and password
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { handleSignIn } = useUser(); // Custom hook to handle sign-in
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track any errors during sign-in
  const navigate = useNavigate(); // Hook to navigate to different routes

  // Handle input field changes by updating formData state
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update the specific field in formData
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear any previous errors

    try {
      setIsLoading(true); // Set loading state to true while waiting for response
      const { user, token } = await signInUser(formData); // Sign in the user and get the token
      handleSignIn(user, token); // Store the user and token in the app's state
      navigateAfterSignIn(); // Redirect to the appropriate page after sign-in
    } catch (err) {
      handleSignInError(err); // Handle any errors during sign-in
    } finally {
      setIsLoading(false); // Stop loading once the sign-in process is complete
    }
  }

  // Function to sign in the user by sending a request to the API
  async function signInUser(userData: typeof formData): Promise<AuthData> {
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Indicate that the request body is JSON
      body: JSON.stringify(userData), // Send the form data (username, password) as JSON
    };
    const res = await fetch('/api/auth/sign-in', req); // Send the request to the sign-in API
    if (!res.ok) {
      const errorData = await res.json(); // Parse the error message from the response
      throw new Error(errorData.error || `Sign-in failed: ${res.status}`); // Throw an error if sign-in fails
    }
    return res.json(); // Return the user and token data if the sign-in is successful
  }

  // Navigate to the appropriate page after successful sign-in
  function navigateAfterSignIn() {
    const zipcode = localStorage.getItem('zipcode'); // Check if a ZIP code was previously stored
    if (zipcode) {
      navigate(`/results/${zipcode}`); // Navigate to the results page with the stored ZIP code
    } else {
      navigate('/'); // Navigate to the home page if no ZIP code is stored
    }
  }

  // Handle any errors during sign-in and display an appropriate message
  function handleSignInError(err: unknown) {
    if (err instanceof Error) {
      setError(err.message); // Display the error message if it's an Error object
    } else {
      setError('An unexpected error occurred during sign-in'); // Fallback error message for unexpected cases
    }
  }

  return (
    <div className="relative min-h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <SignInForm
        formData={formData} // Pass the form data to the SignInForm component
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error} // Pass any error messages
      />
    </div>
  );
}

// SignInForm component: renders the sign-in form
function SignInForm({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}) {
  return (
    <div className="relative z-10 max-w-md w-full bg-teal-800 opacity-90 p-8 rounded-xl shadow-2xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-50 mb-10">
        Sign In
      </h2>
      {error && <ErrorMessage message={error} />}{' '}
      {/* Display error message if any */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <InputField
          id="username"
          name="username"
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange} // Handle changes in the username input field
        />
        <InputField
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange} // Handle changes in the password input field
        />
        <SubmitButton isLoading={isLoading} /> {/* Show the submit button */}
      </form>
      <SignUpLink /> {/* Link to the sign-up page */}
    </div>
  );
}

// ErrorMessage component: displays an error message
function ErrorMessage({ message }) {
  return (
    <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 rounded p-2">
      {message}
    </div>
  );
}

// InputField component: renders an input field in the form
function InputField({ id, name, type, placeholder, value, onChange }) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder} {/* Screen reader only label */}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:z-10 sm:text-sm"
        placeholder={placeholder} // Placeholder text
        value={value} // Value bound to formData state
        onChange={onChange} // Handle changes to input
      />
    </div>
  );
}

// SubmitButton component: renders the submit button
function SubmitButton({ isLoading }) {
  return (
    <button
      type="submit"
      disabled={isLoading} // Disable the button if loading
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-gray-50 bg-teal-600 hover:bg-gradient-to-r from-gray-800 to-teal-500 transition duration-300 shadow-md hover:shadow-lg hover:border-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : '' // Apply styling if loading
      }`}>
      {isLoading ? 'Signing In...' : 'Sign In'} {/* Display loading state */}
    </button>
  );
}

// SignUpLink component: link to the sign-up page
function SignUpLink() {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-50">
        Don't have an account?{' '}
        <Link
          to="/sign-up"
          className="font-medium text-teal-400 hover:text-emerald-300">
          Sign up {/* Navigate to the sign-up page */}
        </Link>
      </p>
    </div>
  );
}

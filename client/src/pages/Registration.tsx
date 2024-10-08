import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Main Registration component, responsible for handling user registration
export function Registration(): JSX.Element {
  // Local state for form data, initialized with empty values
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle input field changes and update formData state accordingly
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update the specific field in formData
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Ensure passwords match before proceeding
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match"); // Set error message if passwords do not match
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(formData); // Call the registerUser function to submit the form
      navigate('/sign-in'); // Navigate to the sign-in page upon successful registration
    } catch (err) {
      handleRegistrationError(err); // Handle any errors encountered during registration
    } finally {
      setIsLoading(false); // Reset loading state after form submission is complete
    }
  }

  // Function to register the user by sending a request to the API
  async function registerUser(userData: typeof formData) {
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };

    const res = await fetch('/api/auth/sign-up', req); // Send the POST request to the API
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Registration failed: ${res.status}`);
    }
  }

  // Function to handle errors during registration and display appropriate messages
  function handleRegistrationError(err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred during registration');
    }
  }

  return (
    <div className="relative min-h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <RegistrationForm
        formData={formData} // Pass the form data to the RegistrationForm component
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

// RegistrationForm component: renders the registration form
function RegistrationForm({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}) {
  return (
    <div className="relative z-10 max-w-md w-full bg-teal-800 opacity-90 p-8 rounded-xl shadow-2xl">
      <h2 className="text-center text-3xl font-extrabold text-gray-50 mb-6">
        Register Account
      </h2>
      {error && <ErrorMessage message={error} />}{' '}
      {/* Display error message if any */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4 my-10">
          <InputField
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <InputField
            id="confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <SubmitButton isLoading={isLoading} /> {/* Show the submit button */}
      </form>
      <SignInLink /> {/* Link to the sign-in page */}
    </div>
  );
}

// ErrorMessage component: displays an error message
function ErrorMessage({ message }) {
  return (
    <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 rounded p-2">
      {message} {/* Render the error message */}
    </div>
  );
}

// InputField component: renders an input field in the form
function InputField({
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  className = '',
}) {
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
        className={`appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={value} // Value bound to formData state
        onChange={onChange}
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
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-full text-teal-900 bg-gray-50 hover:bg-gradient-to-r from-gray-800 to-teal-500 transition duration-300 shadow-md hover:shadow-lg hover:border-teal-700 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : '' // Apply styling if loading
      }`}>
      {isLoading ? 'Signing Up...' : 'Sign Up'} {/* Display loading state */}
    </button>
  );
}

// SignInLink component: link to the sign-in page
function SignInLink() {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-50">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-medium text-teal-300 hover:text-teal-200">
          Sign in {/* Navigate to the sign-in page */}
        </Link>
      </p>
    </div>
  );
}

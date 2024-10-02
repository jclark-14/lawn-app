import React, { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Main Registration component
export function Registration(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle input changes
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      setIsLoading(true);
      await registerUser(formData);
      navigate('/sign-in');
    } catch (err) {
      handleRegistrationError(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Register user
  async function registerUser(userData: typeof formData) {
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
    const res = await fetch('/api/auth/sign-up', req);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Registration failed: ${res.status}`);
    }
  }

  // Handle registration error
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
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

// RegistrationForm component
function RegistrationForm({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  error,
}) {
  return (
    <div className="relative z-10 max-w-md w-full bg-white opacity-90 p-8 rounded-xl shadow-2xl">
      <h2 className="text-center text-3xl font-extrabold text-teal-900 mb-6">
        Register Account
      </h2>
      {error && <ErrorMessage message={error} />}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <InputField
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="rounded-t-md"
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
            className="rounded-b-md"
          />
        </div>
        <SubmitButton isLoading={isLoading} />
      </form>
      <SignInLink />
    </div>
  );
}

// ErrorMessage component
function ErrorMessage({ message }) {
  return (
    <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 rounded p-2">
      {message}
    </div>
  );
}

// InputField component
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
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

// SubmitButton component
function SubmitButton({ isLoading }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-gradient-to-r from-slate-700 to-teal-600 transition duration-300 shadow-md hover:shadow-lg hover:border-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-900 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
      {isLoading ? 'Signing Up...' : 'Sign Up'}
    </button>
  );
}

// SignInLink component
function SignInLink() {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-600">
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-medium text-teal-700 hover:text-teal-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}

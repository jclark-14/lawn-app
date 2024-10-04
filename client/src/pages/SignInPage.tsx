import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, useUser } from '../components/useUser';

// Type definition for authentication data
type AuthData = {
  user: User;
  token: string;
};

// Main SignInPage component
export function SignInPage(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { handleSignIn } = useUser();
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
    setError(null);
    try {
      setIsLoading(true);
      const { user, token } = await signInUser(formData);
      handleSignIn(user, token);
      navigateAfterSignIn();
    } catch (err) {
      handleSignInError(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Sign in user
  async function signInUser(userData: typeof formData): Promise<AuthData> {
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
    const res = await fetch('/api/auth/sign-in', req);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `Sign-in failed: ${res.status}`);
    }
    return res.json();
  }

  // Navigate after successful sign-in
  function navigateAfterSignIn() {
    const zipcode = localStorage.getItem('zipcode');
    if (zipcode) {
      navigate(`/results/${zipcode}`);
    } else {
      navigate('/');
    }
  }

  // Handle sign-in error
  function handleSignInError(err: unknown) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError('An unexpected error occurred during sign-in');
    }
  }

  return (
    <div className="relative min-h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <SignInForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}

// SignInForm component
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
      {error && <ErrorMessage message={error} />}
      <form className="space-y-6" onSubmit={handleSubmit}>
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
        <SubmitButton isLoading={isLoading} />
      </form>
      <SignUpLink />
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
function InputField({ id, name, type, placeholder, value, onChange }) {
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
        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-teal-600 focus:border-teal-600 focus:z-10 sm:text-sm"
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
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-gray-50 bg-teal-600 hover:bg-gradient-to-r from-stone-700 to-teal-500 transition duration-300 shadow-md hover:shadow-lg hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 ${
        isLoading ? 'opacity-50 cursor-not-allowed' : ''
      }`}>
      {isLoading ? 'Signing In...' : 'Sign In'}
    </button>
  );
}

// SignUpLink component
function SignUpLink() {
  return (
    <div className="text-center mt-4">
      <p className="text-sm text-gray-50">
        Don't have an account?{' '}
        <Link
          to="/sign-up"
          className="font-medium text-teal-400 hover:text-emerald-300">
          Sign up
        </Link>
      </p>
    </div>
  );
}

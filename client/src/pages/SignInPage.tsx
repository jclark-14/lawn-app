import { type FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, useUser } from '../components/useUser';

type AuthData = {
  user: User;
  token: string;
};

export function SignInPage(): JSX.Element {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      setIsLoading(true);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Sign-in failed: ${res.status}`);
      }
      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      const zipcode = localStorage.getItem('zipcode');
      if (zipcode) {
        navigate(`/results/${zipcode}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred during sign-in');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative min-h-full w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background with opacity */}

      {/* Content */}
      <div className="relative z-10 max-w-md w-full bg-white opacity-90 p-8 rounded-xl shadow-2xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-800 mb-6">
          Sign in to view your account
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-center bg-red-100 border border-red-400 rounded p-2">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-gradient-to-r from-emerald-600 to-teal-700 transition duration-300 shadow-md hover:shadow-lg hover:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-900 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/sign-up"
              className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

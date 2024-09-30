import { Search, Leaf, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Homepage() {
  const navigate = useNavigate();
  const [zipcode, setZipcode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/grass-species/${zipcode}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      // If the request is successful, navigate to the results page
      navigate(`/results/${zipcode}`);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative flex-grow flex flex-col">
      <div className="relative z-10 py-12 sm:py-14 flex-grow flex flex-col justify-center">
        <div className="px-4 sm:px-6 lg:px-8 w-full">
          <div className="mx-auto max-w-7xl w-full">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-700">
                Get Your Perfect Lawn
              </h2>
              <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
                Personalized lawn care plans that cater to your unique climate
                and lawn needs. Create a vibrant, green lawn that you can be
                proud of!
              </p>

              <form
                className="flex flex-col items-center relative"
                onSubmit={handleSubmit}>
                <div className="flex mb-2 w-full max-w-md justify-center">
                  <input
                    type="text"
                    placeholder="Enter your zipcode"
                    className="px-4 py-2 rounded-l-[8px] w-full max-w-[200px] border border-gray-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:z-10"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-emerald-600 text-white px-4 sm:px-8 py-2.5 text-nowrap rounded-r-[8px] text-lg font-semibold transition-all ease-in-out duration-500 hover:bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-md hover:shadow-lg ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}>
                    {isLoading ? 'Loading...' : 'Get Started'}
                  </button>
                </div>
                {error && (
                  <p className="text-red-500 mt-2 absolute top-14">{error}</p>
                )}
              </form>
            </div>

            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 mx-2 md:mx-2">
              <div className="bg-gray-100 p-8 opacity-95 rounded-lg shadow-md flex-1 transition duration-300 hover:shadow-lg">
                <Search size={64} className="mx-auto mb-6 text-emerald-700" />
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  Locate Your Zone
                </h3>
                <p className="text-center text-gray-700">
                  Find the perfect grass species for your climate. Our expert
                  system considers your local weather patterns and soil
                  conditions.
                </p>
              </div>
              <div className="bg-gray-100 p-8 opacity-95 rounded-lg shadow-md flex-1 min-w-[250px] transition duration-300 hover:shadow-lg">
                <Leaf size={64} className="mx-auto mb-6 text-emerald-700" />
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  Customized Plans
                </h3>
                <p className="text-center text-gray-700">
                  Get tailored advice for new or existing lawns. Our plans
                  account for your lawn's unique characteristics and your
                  personal goals.
                </p>
              </div>
              <div className="bg-gray-100 p-8 opacity-95 rounded-lg shadow-md flex-1 min-w-[250px] transition duration-300 hover:shadow-lg">
                <ClipboardList
                  size={64}
                  className="mx-auto mb-6 text-emerald-700"
                />
                <h3 className="text-2xl font-semibold mb-6 text-center">
                  Track Progress
                </h3>
                <p className="text-center text-gray-700">
                  Follow your lawn care plan step by step. Our intuitive
                  tracking system helps you visualize your lawn's improvement
                  over time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

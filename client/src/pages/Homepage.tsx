import { Search, Leaf, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Main Homepage component
export function Homepage() {
  const navigate = useNavigate();
  const [zipcode, setZipcode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
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
            <HeroSection
              zipcode={zipcode}
              setZipcode={setZipcode}
              handleSubmit={handleSubmit}
              error={error}
              isLoading={isLoading}
            />
            <FeatureSection />
          </div>
        </div>
      </div>
    </main>
  );
}

// Hero section component
function HeroSection({ zipcode, setZipcode, handleSubmit, error, isLoading }) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-teal-800">
        Get Your Perfect Lawn
      </h2>
      <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
        Personalized lawn care plans that cater to your unique climate and lawn
        needs. Create a vibrant, green lawn that you can be proud of!
      </p>
      <ZipcodeForm
        zipcode={zipcode}
        setZipcode={setZipcode}
        handleSubmit={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}

// Zipcode form component
function ZipcodeForm({ zipcode, setZipcode, handleSubmit, error, isLoading }) {
  return (
    <form
      className="flex flex-col items-center relative"
      onSubmit={handleSubmit}>
      <div className="flex mb-2 w-full max-w-md justify-center">
        <input
          type="text"
          placeholder="Enter your zipcode"
          className="px-4 py-3 rounded-l-full w-full max-w-[200px] shadow-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 focus:z-10"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-teal-700 text-white px-4 sm:px-8 py-2.5 text-nowrap rounded-r-full text-lg font-semibold transition-all ease-in-out duration-500 hover:bg-gradient-to-r from-slate-600 to-teal-600 shadow-lg hover:shadow-xl ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
          {isLoading ? 'Loading...' : 'Get Started'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2 absolute top-14">{error}</p>}
    </form>
  );
}

// Feature section component
function FeatureSection() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 mx-2 md:mx-2">
      <FeatureCard
        icon={<Search size={64} className="mx-auto mb-6 text-teal-700" />}
        title="Locate Your Zone"
        description="Find the perfect grass species for your climate. Our expert system considers your local weather patterns and soil conditions."
      />
      <FeatureCard
        icon={<Leaf size={64} className="mx-auto mb-6 text-teal-700" />}
        title="Customized Plans"
        description="Get tailored advice for new or existing lawns. Our plans account for your lawn's unique characteristics and your personal goals."
      />
      <FeatureCard
        icon={
          <ClipboardList size={64} className="mx-auto mb-6 text-teal-700" />
        }
        title="Track Progress"
        description="Follow your lawn care plan step by step. Our intuitive tracking system helps you visualize your lawn's improvement over time."
      />
    </div>
  );
}

// Feature card component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-100 p-8 opacity-95 rounded-lg shadow-md flex-1 min-w-[250px] transition duration-300 hover:shadow-lg">
      {icon}
      <h3 className="text-2xl font-semibold mb-4 text-center">{title}</h3>
      <p className="text-center text-gray-700">{description}</p>
    </div>
  );
}

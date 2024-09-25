import { Search, Leaf, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Homepage() {
  const navigate = useNavigate();
  const [zipcode, setZipcode] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    navigate(`/results/${zipcode}`);
  }

  return (
    <>
      <main className="flex-grow flex flex-col">
        <div className="bg-white bg-opacity-85 py-12 sm:py-16 flex-grow flex flex-col justify-center">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-7xl h-full">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                  Get Your Perfect Lawn
                </h2>
                <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-700">
                  Personalized lawn care plans that cater to your unique climate
                  and lawn needs. Create a vibrant, green lawn that you can be
                  proud of!
                </p>

                <form className="flex justify-center" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your zipcode"
                    className="px-4 py-2 rounded-l w-64"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-8 py-2.5 rounded text-lg font-semibold transition-all ease-in-out duration-500 hover:bg-gradient-to-r from-green-600 to-teal-600  shadow-md hover:shadow-lg">
                    Get Started
                  </button>
                </form>
              </div>

              <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 mx-2  md:mx-2">
                <div className="bg-slate-50 p-8 rounded-lg shadow-md flex-1 transition duration-300 hover:shadow-lg">
                  <Search
                    size={64}
                    className=" mx-auto mb-6 text-emerald-700"
                  />
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    Locate Your Zone
                  </h3>
                  <p className="text-center text-gray-700">
                    Find the perfect grass species for your climate. Our expert
                    system considers your local weather patterns and soil
                    conditions.
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-lg shadow-md flex-1 min-w-[250px] transition duration-300 hover:shadow-lg">
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
                <div className="bg-slate-50 p-8 rounded-lg shadow-md flex-1 min-w-[250px] transition duration-300 hover:shadow-lg">
                  <ClipboardList
                    size={64}
                    className="mx-auto mb-6 text-emerald-700"
                  />
                  <h3 className="text-2xl font-semibold mb-4 text-center">
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
    </>
  );
}

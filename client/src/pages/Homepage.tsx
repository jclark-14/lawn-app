import { Search, Leaf, ClipboardList } from 'lucide-react';

export function Homepage() {
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
                <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
                  Personalized lawn care plans based on your location and needs.
                  Transform your outdoor space into a lush, green oasis.
                </p>
                <div className="flex justify-center">
                  <input
                    type="text"
                    placeholder="Enter your zipcode"
                    className="px-4 py-2 rounded-l w-64"
                  />
                  <button className="bg-green-600 text-white px-6 rounded-r transition duration-300 hover:bg-green-700 hover:shadow-md">
                    Get Started
                  </button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row flex-wrap justify-center gap-8 mx-2  md:mx-2">
                <div className="bg-white p-8 rounded-lg shadow-md flex-1">
                  <Search size={64} className=" mx-auto mb-6 text-green-600" />
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    Locate Your Zone
                  </h3>
                  <p className="text-center">
                    Find the perfect grass species for your climate. Our expert
                    system considers your local weather patterns and soil
                    conditions.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md flex-1 min-w-[250px]">
                  <Leaf size={64} className="mx-auto mb-6 text-green-600" />
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    Customized Plans
                  </h3>
                  <p className="text-center">
                    Get tailored advice for new or existing lawns. Our plans
                    account for your lawn's unique characteristics and your
                    personal goals.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-md flex-1 min-w-[250px]">
                  <ClipboardList
                    size={64}
                    className="mx-auto mb-6 text-green-600"
                  />
                  <h3 className="text-2xl font-semibold mb-4 text-center">
                    Track Progress
                  </h3>
                  <p className="text-center">
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

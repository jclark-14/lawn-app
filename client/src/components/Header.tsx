import { Link, Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export function Header() {
  return (
    <div className="font-normal flex flex-col min-h-screen ">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("/images/grassimg1.jpg")' }}></div>
      <div className="fixed inset-0 bg-gradient-to-b from-white to-emerald-700 opacity-80 z-1"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-green-800 bg-opacity-80 text-gray-100">
          <header className="py-3.5 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center">
                <Link to="/" className="flex-shrink-0">
                  <h1 className="text-xl sm:text-3xl font-bold">
                    LawnCare Pro
                  </h1>
                </Link>
                <nav className="flex space-x-4 md:space-x-8 justify-between items-center sm:text-lg">
                  <Link to="/" className="relative group">
                    <span className="hover:text-teal-100 transition-colors duration-300">
                      Home
                    </span>
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></span>
                  </Link>
                  <Link to="/about" className="relative group">
                    <span className="hover:text-teal-100 transition-colors duration-300">
                      About
                    </span>
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></span>
                  </Link>
                  <div className="relative">
                    <Link
                      to="/sign-in"
                      className="bg-emerald-800 sm:text-lg text-sm py-1.5 px-4 rounded-[6px] bg-opacity-60 inline-block transition-all duration-500 ease-in-out hover:bg-emerald-800">
                      <span className="inline-block min-w-[40px] text-center">
                        Login
                      </span>
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </header>
        </div>

        {/* Main content */}
        <main className="flex-grow flex">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

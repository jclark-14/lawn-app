import { Link, Outlet } from 'react-router-dom';
import { Footer } from './Footer';

export function Header() {
  return (
    <div
      className="font-normal flex flex-col min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/grassimg1.jpg")' }}>
      <div className="bg-emerald-600 bg-opacity-85 text-gray-100">
        <header className="py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold">LawnCare Pro</h1>
              </Link>
              <nav className="flex space-x-4 md:space-x-8 justify-between items-center">
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
                <Link
                  to="/login"
                  className="bg-emerald-700 text-sm py-1.5 px-3 rounded-[4px] transition-all duration-500 ease-in-out hover:bg-gradient-to-r from-green-700 to-teal-500 hover:shadow-md hover:scale-105 hover:font-semibold">
                  <span className="inline-block min-w-[40px] text-center">
                    Login
                  </span>
                </Link>
              </nav>
            </div>
          </div>
        </header>
      </div>
      <Outlet />
      <Footer />
    </div>
  );
}

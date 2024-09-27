import { Link, Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { useUser } from './useUser';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { user, handleSignOut } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when clicking outside (unchanged)
  useEffect(() => {
    const closeMenu = (e) => {
      if (
        isMenuOpen &&
        !e.target.closest('.mobile-menu') &&
        !e.target.closest('.menu-toggle')
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [isMenuOpen]);

  return (
    <div className="font-normal flex flex-col min-h-screen">
      {/* Background image and gradient overlay remain unchanged */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("/images/grassimg1.jpg")' }}></div>
      <div className="fixed inset-0 bg-gradient-to-b from-white to-emerald-700 opacity-80 z-1"></div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="bg-green-800 bg-opacity-80 text-gray-100 w-full">
          <header className="py-3.5 px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-7xl mx-auto w-full">
              <div className="flex items-center justify-between w-full">
                {/* Logo and user greeting */}
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <Link to="/" className="flex-shrink-0">
                    <h1 className="text-xl sm:text-3xl font-bold">
                      LawnCare Pro
                    </h1>
                  </Link>
                  {user && (
                    <span className="text-white text-md">
                      Hello, {user.username}
                    </span>
                  )}
                </div>

                {/* Hamburger menu for mobile */}
                <button
                  onClick={toggleMenu}
                  className="lg:hidden text-white focus:outline-none menu-toggle">
                  <Menu size={24} />
                </button>

                {/* Navigation for larger screens */}
                <nav className="hidden lg:flex items-center space-x-8 text-lg">
                  <NavLinks user={user} handleSignOut={handleSignOut} />
                </nav>
              </div>
            </div>
          </header>
        </div>

        {/* Mobile menu (unchanged) */}
        <div
          className={`fixed inset-y-0.5 right-0 bg-gray-100 text-gray-800  h-fit w-fit rounded-lg shadow-lg px-4 pb-6 text-center  transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="flex flex-wrap justify-end pt-3">
            <button
              onClick={toggleMenu}
              className="text-emerald-900 focus:outline-none">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-4 px-6 mobile-menu">
            <NavLinks user={user} handleSignOut={handleSignOut} />
          </nav>
        </div>

        {/* Main content and Footer remain unchanged */}
        <main className="flex-grow flex">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function NavLinks({ user, handleSignOut }) {
  return (
    <>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      {user && <NavLink to="/:user">Profile</NavLink>}
      {user ? (
        <button
          onClick={handleSignOut}
          className="bg-emerald-800 text-sm text-gray-100 sm:text-lg py-1.5 px-4 rounded-[6px] bg-opacity-60 transition-all duration-500 ease-in-out hover:bg-emerald-800">
          Logout
        </button>
      ) : (
        <Link
          to="/sign-in"
          className="bg-emerald-800 text-sm sm:text-lg py-1.5 px-4 rounded-[6px] bg-opacity-60 transition-all duration-500 ease-in-out hover:bg-emerald-800">
          <span className="inline-block min-w-[40px] text-center">Login</span>
        </Link>
      )}
    </>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="relative group">
      <span className="hover:text-teal-100 transition-colors duration-300">
        {children}
      </span>
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></span>
    </Link>
  );
}

import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Footer } from './Footer';
import { useUser } from './useUser';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

// Main Header component
export function Header() {
  const { user, handleSignOut } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close menu when clicking outside
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
      <BackgroundImage />
      <ContentWrapper>
        <HeaderBar
          user={user}
          toggleMenu={toggleMenu}
          handleSignOut={handleSignOut}
        />
        <MobileMenu
          isOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          user={user}
          handleSignOut={handleSignOut}
        />
        <main className="flex-grow flex">
          <Outlet />
        </main>
        <Footer />
      </ContentWrapper>
    </div>
  );
}

// Background image and gradient overlay
function BackgroundImage() {
  return (
    <>
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed z-0"
        style={{ backgroundImage: 'url("/images/grassimg1.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-teal-700 opacity-80 z-1" />
    </>
  );
}

// Content wrapper
function ContentWrapper({ children }) {
  return (
    <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
  );
}

// Header bar component
function HeaderBar({ user, toggleMenu, handleSignOut }) {
  return (
    <div className="bg-teal-900 bg-opacity-85 text-gray-100 w-full">
      <header className="py-3.5 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between w-full">
            <LogoAndGreeting user={user} />
            <HamburgerButton toggleMenu={toggleMenu} />
            <DesktopNavigation user={user} handleSignOut={handleSignOut} />
          </div>
        </div>
      </header>
    </div>
  );
}

// Logo and user greeting
function LogoAndGreeting({ user }) {
  return (
    <div className="flex items-center space-x-4 sm:space-x-6">
      <Link to="/" className="flex-shrink-0">
        <h1 className="text-xl sm:text-3xl font-bold">LawnCare Pro</h1>
      </Link>
      {user && (
        <span className="text-gray-50 text-md">Hello, {user.username}</span>
      )}
    </div>
  );
}

// Hamburger button for mobile
function HamburgerButton({ toggleMenu }) {
  return (
    <button
      onClick={toggleMenu}
      className="lg:hidden text-gray-50 focus:outline-none menu-toggle">
      <Menu size={24} />
    </button>
  );
}

// Desktop navigation
function DesktopNavigation({ user, handleSignOut, toggleMenu }) {
  return (
    <nav className="hidden lg:flex items-center space-x-8 text-lg">
      <NavLinks
        user={user}
        handleSignOut={handleSignOut}
        toggleMenu={toggleMenu}
        isMobile={false}
      />
    </nav>
  );
}

// Mobile menu
function MobileMenu({ isOpen, toggleMenu, user, handleSignOut }) {
  return (
    <div
      className={`fixed inset-y-0.5 right-0 bg-gray-100 text-teal-900 w-full font-medium text-2xl shadow-lg px-4 pb-6 text-center transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
      <div className="flex flex-wrap justify-end pt-3">
        <button
          onClick={toggleMenu}
          className="text-emerald-900 focus:outline-none">
          <X size={24} />
        </button>
      </div>
      <nav className="flex flex-col space-y-14 px-6 mt-10 mobile-menu">
        <NavLinks
          user={user}
          handleSignOut={handleSignOut}
          toggleMenu={toggleMenu}
          isMobile={true}
        />
      </nav>
    </div>
  );
}

// Navigation links
function NavLinks({ user, handleSignOut, toggleMenu, isMobile }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && toggleMenu) {
      toggleMenu();
    }
  };

  return (
    <>
      <NavLink to="/" onClick={() => handleNavigation('/')} isMobile={isMobile}>
        Home
      </NavLink>
      {user && (
        <NavLink
          to="/profile"
          onClick={() => handleNavigation('/profile')}
          isMobile={isMobile}>
          Profile
        </NavLink>
      )}
      <NavLink
        to="/about"
        onClick={() => handleNavigation('/about')}
        isMobile={isMobile}>
        About
      </NavLink>
      {user ? (
        <LogoutButton
          handleSignOut={() => {
            handleSignOut();
            if (isMobile && toggleMenu) {
              toggleMenu();
            }
          }}
        />
      ) : (
        <LoginButton onClick={() => handleNavigation('/sign-in')} />
      )}
    </>
  );
}

// Navigation link component
function NavLink({ to, onClick, children, isMobile }) {
  if (isMobile) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="relative group w-full text-left flex justify-center">
        <span className="hover:text-teal-700 transition-colors duration-300">
          {children}
        </span>
        <span className="absolute left-0 bottom-0 w-full h-0.5 bg-teal-700 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></span>
      </Link>
    );
  }

  return (
    <Link to={to} onClick={onClick} className="relative group">
      <span className="hover:text-teal-100 transition-colors duration-300">
        {children}
      </span>
      <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gray-200 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></span>
    </Link>
  );
}

// Logout button
function LogoutButton({ handleSignOut }) {
  return (
    <button
      onClick={handleSignOut}
      className="bg-teal-700 text-xl text-gray-100 sm:text-lg py-4 sm:py-2 px-4 rounded-full border border-solid shadow-lg border-teal-800 transition-all duration-500 ease-in-out hover:bg-gradient-to-r from-gray-800 to-teal-500">
      Logout
    </button>
  );
}

// Login button
function LoginButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-teal-700 text-xl text-gray-100 sm:text-lg py-4 sm:py-2 px-5 rounded-full border border-solid shadow-lg border-teal-800 transition-all duration-500 ease-in-out  hover:bg-gradient-to-r from-gray-800 to-teal-500">
      <span className="inline-block min-w-[40px] text-center">Login</span>
    </button>
  );
}

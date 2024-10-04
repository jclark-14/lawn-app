import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-teal-900 py-7 text-gray-100 bg-opacity-55">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Main footer text */}
          <p className="text-lg mb-2 text-gray-100">
            Explore the Tech Behind LawnCare Pro
          </p>

          {/* Social media links */}
          <div className="flex space-x-4 mb-4">
            <SocialLink
              href="https://github.com/jclark-14"
              icon={<FaGithub size={23} />}
              label="GitHub"
            />
            <SocialLink
              href="https://linkedin.com/in/clark-jody/"
              icon={<FaLinkedin size={23} />}
              label="LinkedIn"
            />
          </div>

          {/* Project details button */}
          <Link to="/about">
            <button className="bg-gray-200 text-teal-800 px-8 py-3.5 rounded-full text-md font-semibold hover:bg-gradient-to-r from-stone-700 to-teal-500 transition duration-300 shadow-md hover:shadow-lg hover:text-white hover:border-emerald-600">
              View Project Details
            </button>
          </Link>

          <p className="mt-4 text-gray-100 text-sm">
            Designed & Developed by Jody Clark
          </p>
        </div>
      </div>
    </footer>
  );
}

// SocialLink component for social media links
function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-teal-400 text-gray-100 transition-colors duration-300"
      aria-label={label}>
      {icon}
    </a>
  );
}

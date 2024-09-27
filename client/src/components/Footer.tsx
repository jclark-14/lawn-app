import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-emerald-900 py-6 text-gray-100 bg-opacity-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-lg mb-2">Explore the Tech Behind LawnCare Pro</p>
          <div className="flex space-x-4 mb-4">
            <a
              href="https://github.com/jclark-14"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors duration-300">
              <FaGithub size={23} />
            </a>
            <a
              href="https://linkedin.com/in/clark-jody/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors duration-300">
              <FaLinkedin size={23} />
            </a>
          </div>
          <Link to="/about">
            <button className="bg-gray-200 text-green-800 px-6 py-3 rounded text-md font-semibold hover:bg-gradient-to-r from-emerald-800 to-emerald-600 transition duration-300 shadow-md hover:shadow-lg hover:text-white hover:border-emerald-600">
              View Project Details
            </button>
          </Link>
          <p className="mt-4 text-sm">Designed & Developed by Jody Clark</p>
        </div>
      </div>
    </footer>
  );
}

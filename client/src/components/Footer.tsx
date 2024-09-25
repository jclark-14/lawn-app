import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-green-800 py-8 text-white bg-opacity-90">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <p className="text-xl mb-4">Explore the Tech Behind LawnCare Pro</p>
          <div className="flex space-x-4 mb-6">
            <a
              href="https://github.com/jclark-14"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 transition-colors duration-300">
              <FaGithub size={24} />
            </a>
            <a
              href="https://linkedin.com/in/clark-jody/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-300 transition-colors duration-300">
              <FaLinkedin size={24} />
            </a>
          </div>
          <Link to="/about">
            <button className="bg-white text-green-800 px-8 py-3 rounded text-lg font-semibold hover:bg-gray-100 hover:transform hover:scale-105 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
              View Project Details
            </button>
          </Link>
          <p className="mt-6 text-sm">Designed & Developed by Jody Clark</p>
        </div>
      </div>
    </footer>
  );
}

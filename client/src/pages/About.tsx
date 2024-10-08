import {
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaLeaf,
  FaClipboardList,
  FaSearchLocation,
} from 'react-icons/fa';
import { SiPostgresql, SiTailwindcss, SiTypescript } from 'react-icons/si';

export function About() {
  return (
    <div className="relative flex-grow min-h-screen flex flex-col">
      {/* Content */}
      <main className="relative z-10 flex-grow py-12 sm:py-14 px-4 mx-auto max-w-7xl">
        <div className="container mx-auto px-4 pt-8 pb-10 sm:px-6 lg:px-8 bg-teal-900 bg-opacity-75 rounded-xl shadow-xl">
          <PageTitle />
          <ProjectOverview />
          <KeyFeatures />
          <TechnologyStack />
          <ImplementationHighlights />
          <FutureEnhancements />
        </div>
      </main>
    </div>
  );
}

// Page title component
function PageTitle() {
  return (
    <h1 className="text-4xl font-bold text-center mb-12 text-gray-50">
      Project Details
    </h1>
  );
}

// Project overview section
function ProjectOverview() {
  return (
    <section className="mb-16 bg-gray-100 opacity-95 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-teal-700">
        Project Overview
      </h2>
      <p className="text-lg mb-4 text-gray-700">
        LawnCare Pro is a comprehensive web application designed to provide
        personalized lawn care plans based on users' specific locations and
        needs. By leveraging climate data and horticultural expertise, the aim
        is to help users transform their outdoor spaces into the lawn of their
        dreams.
      </p>
      <p className="text-lg mb-4 text-gray-700">
        This project showcases a full-stack implementation using modern web
        technologies and demonstrates proficiency in building scalable,
        user-centric applications.
      </p>
    </section>
  );
}

// Key features section
function KeyFeatures() {
  return (
    <section className="mb-16 opacity-95">
      <h2 className="text-3xl font-semibold mb-6 text-gray-50 text-center">
        Key Features
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FaSearchLocation className="text-teal-700" size={64} />}
          title="Location-based Recommendations"
          description="Utilizes zipcode data to provide climate-specific grass species recommendations."
        />
        <FeatureCard
          icon={<FaLeaf className="text-teal-700" size={64} />}
          title="Customized Care Plans"
          description="Generates tailored lawn care plans for new or existing lawns based on user input and local conditions."
        />
        <FeatureCard
          icon={<FaClipboardList className="text-teal-700" size={64} />}
          title="Progress Tracking"
          description="Allows users to track their lawn care progress with step-by-step guidance and completion tracking."
        />
      </div>
    </section>
  );
}

// Technology stack section
function TechnologyStack() {
  return (
    <section className="mb-16 bg-gray-100 opacity-95 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-teal-700">
        Technology Stack
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        <TechCard icon={<FaReact size={40} />} name="React" />
        <TechCard icon={<SiTypescript size={40} />} name="TypeScript" />
        <TechCard icon={<FaNodeJs size={40} />} name="Node.js" />
        <TechCard icon={<SiPostgresql size={40} />} name="PostgreSQL" />
        <TechCard icon={<SiTailwindcss size={40} />} name="Tailwind CSS" />
        <TechCard icon={<FaDatabase size={40} />} name="RESTful API" />
      </div>
    </section>
  );
}

// Implementation highlights section
function ImplementationHighlights() {
  return (
    <section className="mb-16 bg-gray-100 opacity-95 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-teal-700">
        Implementation Highlights
      </h2>
      <ul className="list-disc list-inside text-lg space-y-4 text-gray-700">
        <li>
          Responsive design using Tailwind CSS for a seamless experience across
          devices
        </li>
        <li>
          Server-side rendering with Next.js for improved performance and SEO
        </li>
        <li>
          RESTful API design for efficient communication between frontend and
          backend
        </li>
        <li>
          Database schema optimized for quick retrieval of lawn care plans and
          user data
        </li>
        <li>
          Integration with external climate data APIs for accurate,
          location-specific recommendations
        </li>
        <li>Secure user authentication and authorization system</li>
      </ul>
    </section>
  );
}

// Future enhancements section
function FutureEnhancements() {
  return (
    <section className="bg-gray-100 opacity-95 p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-teal-700">
        Future Enhancements
      </h2>
      <ul className="list-disc list-inside text-lg space-y-4 text-gray-700">
        <li>
          Integration with IoT devices for automated lawn condition monitoring
        </li>
        <li>
          Machine learning algorithms to improve recommendation accuracy over
          time
        </li>
        <li>
          Community features allowing users to share tips and showcase their
          lawn transformations
        </li>
        <li>Mobile app development for on-the-go lawn care management</li>
      </ul>
    </section>
  );
}

// Feature card component
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-100 p-8 rounded-lg shadow-md flex flex-col items-center transition duration-300 hover:shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center text-teal-800">
        {title}
      </h3>
      <p className="text-center text-gray-700">{description}</p>
    </div>
  );
}

// Technology card component
function TechCard({ icon, name }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-teal-700">{icon}</div>
      <p className="text-center font-semibold text-teal-800">{name}</p>
    </div>
  );
}

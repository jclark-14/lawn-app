import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './pages/Homepage';
import { ResultsPage } from './pages/ResultsPage';
import ProjectDetails from './pages/ProjectDetails';
import { Registration } from './pages/Registration';
import { SignInPage } from './pages/SignInPage';
import { NewPlan } from './pages/NewPlan';
import { PlanDetails } from './pages/PlanDetails';
import { UserProvider } from './components/UserContext';
import { UserProfile } from './pages/UserProfile';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Header component wraps all routes */}
        <Route element={<Header />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<ProjectDetails />} />
          <Route path="/results/:zipcode" element={<ResultsPage />} />
          <Route path="/sign-up" element={<Registration />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/new-plan" element={<NewPlan />} />
          <Route path="/plan/:planId" element={<PlanDetails />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

// NotFound component for 404 errors
function NotFound() {
  return (
    <div className="text-center py-12 mb-4 ml-10 place-content-center w-full">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './pages/Homepage';
import { ResultsPage } from './pages/ResultsPage';
import ProjectDetails from './pages/ProjectDetails';
import { Registration } from './pages/Registration';
import { SignInPage } from './pages/SignInPage';
import { NewPlan } from './pages/NewPlan';
import { Test } from './pages/Test';
import { PlanDetails } from './pages/PlanDetails';
import { UserProvider } from './components/UserContext';
import { UserProfile } from './pages/UserProfile';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<ProjectDetails />} />
          <Route path="/results/:zipcode" element={<ResultsPage />} />
          <Route path="/sign-up" element={<Registration />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/new-plan" element={<NewPlan />} />
          <Route path="/plan/:planId" element={<PlanDetails />} />
          <Route path="/:username" element={<UserProfile />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

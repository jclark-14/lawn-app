import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './pages/Homepage';
import { ResultsPage } from './pages/ResultsPage';
import ProjectDetails from './pages/ProjectDetails';
import { Registration } from './pages/Registration';
import { SignInPage } from './pages/SignInPage';
import { Test } from './pages/Test';
import { UserProvider } from './components/UserContext';

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
        </Route>
      </Routes>
    </UserProvider>
  );
}

import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { Homepage } from './pages/Homepage';
import { ResultsPage } from './pages/ResultsPage';
import ProjectDetails from './pages/ProjectDetails';

export default function App() {
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<ProjectDetails />} />
        <Route path="/results/:zipcode" element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}

// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import EligibilityForm from './pages/EligibilityForm';
import ApplicationHistory from './pages/ApplicationHistory';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/loan-eligibility" element={<EligibilityForm />} />
        <Route path="/application-history" element={<ApplicationHistory />} />
      </Routes>
    </Router>
  );
};

export default App;

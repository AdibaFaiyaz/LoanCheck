// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import EligibilityForm from './pages/EligibilityForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loan-eligibility" element={<EligibilityForm />} />
      </Routes>
    </Router>
  );
};

export default App;

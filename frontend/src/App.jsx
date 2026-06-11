import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* The root path '/' now defaults to the HomePage */}
        <Route path="/" element={<HomePage />} />
        
        {/* Your Dashboard is accessible via /dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Any unknown route will redirect the user to the HomePage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import HackathonDetail from './pages/HackathonDetail';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hackathon/:id" element={<HackathonDetail />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
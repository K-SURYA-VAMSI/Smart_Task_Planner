import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import PlanDetail from './pages/PlanDetail';
import PlansList from './pages/PlansList';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans" element={<PlansList />} />
          <Route path="/plans/:id" element={<PlanDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
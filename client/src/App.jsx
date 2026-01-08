import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import LivePrices from './pages/LivePrices';
import SmartLoans from './pages/SmartLoans';
import LoanApplication from './pages/LoanApplication';
import Marketplace from './pages/Marketplace';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import Chatbot from './pages/Chatbot';
import CropAnalytics from './pages/CropAnalytics';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative">
        {/* Fixed Background Image */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />

        {/* Global Overlay */}
        <div className="fixed inset-0 bg-black/40 z-0 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/prices" element={<LivePrices />} />
              <Route path="/loans" element={<SmartLoans />} />
              <Route path="/loans/:id/apply" element={<LoanApplication />} />

              <Route path="/queries" element={<Chatbot />} />
              <Route path="/analytics/:id" element={<CropAnalytics />} />

              {/* Marketplace Routes */}
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/farmer" element={<FarmerDashboard />} />
              <Route path="/marketplace/buyer" element={<BuyerDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;

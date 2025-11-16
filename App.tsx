import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import EmployeeAnalysis from './pages/EmployeeAnalysis';
import PredictionsHistory from './pages/PredictionsHistory';
import BatchProcessing from './pages/BatchProcessing';
import Settings from './pages/Settings';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('shiftsense-theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('shiftsense-theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      <Toaster position="top-right" toastOptions={{
        className: 'font-sans',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }}/>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleTheme={toggleTheme} currentTheme={theme}>
           <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </Header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
           <div className="animate-slide-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis" element={<EmployeeAnalysis />} />
                <Route path="/predictions" element={<PredictionsHistory />} />
                <Route path="/batch" element={<BatchProcessing />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
           </div>
        </main>
      </div>
    </div>
  );
};

export default App;
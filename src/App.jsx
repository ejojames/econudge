import React, { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EcoProvider, EcoContext } from './context/EcoContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EcoSimulator from './components/EcoSimulator';
import Leaderboard from './components/Leaderboard';

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4 md:p-8 overflow-x-hidden"
            >
              <Dashboard />
            </motion.div>
          )}
          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4 md:p-8 overflow-x-hidden"
            >
              <EcoSimulator />
            </motion.div>
          )}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 p-4 md:p-8 overflow-x-hidden"
            >
              <Leaderboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

function App() {
  return (
    <EcoProvider>
      <MainApp />
    </EcoProvider>
  );
}

export default App;

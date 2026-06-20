/**
 * EcoNudge: An automated behavioral nudging ecosystem built for resource management optimization.
 */
import React, { useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EcoProvider } from './context/EcoContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';

// Dynamic imports: secondary views only load when first requested
const EcoSimulator = lazy(() => import('./components/EcoSimulator'));
const Leaderboard = lazy(() => import('./components/Leaderboard'));

const MainApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 relative overflow-y-auto bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
        <Suspense fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        }>
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-4 md:p-8"
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
                className="absolute inset-0 p-4 md:p-8"
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
                className="absolute inset-0 p-4 md:p-8"
              >
                <Leaderboard />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
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

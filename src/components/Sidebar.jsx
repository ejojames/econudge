import React, { useContext, useState, useEffect } from 'react';
import { LayoutDashboard, Leaf, Trophy, Share2, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { EcoContext } from '../context/EcoContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme, user, logout } = useContext(EcoContext);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCursorBlink(b => !b), 500);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'simulator', label: 'Eco-Simulator', icon: Leaf },
    { id: 'leaderboard', label: 'Campus Clash', icon: Trophy },
  ];

  const handleShare = () => {
    if (!user) return;
    const level = Math.floor(user.totalXP / 100) || 1;
    const text = `⚡ @${user.username} just leveled up to Level ${level} Eco-Architect on EcoNudge! Current active Streak: ${user.streakCount} Days. Join my Campus Clash room using access token: #[ROOM_CODE]. Let's save the canopy.`;
    navigator.clipboard.writeText(text);
    alert('Share text copied to clipboard!');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-emerald-500/20 w-full shrink-0 z-50 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 rounded-sm flex items-center justify-center">
            <Leaf className="dark:text-emerald-400 text-emerald-600 w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight dark:text-emerald-400 text-emerald-600">EcoNudge</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 dark:text-zinc-400 text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Sidebar Wrapper */}
      <div className={`
        ${isMobileMenuOpen ? 'fixed inset-0 z-40 flex' : 'hidden'} 
        lg:static lg:flex lg:w-64 lg:h-screen w-full h-[calc(100vh-64px)] 
        bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200 
        border-r border-zinc-200 dark:border-emerald-500/20 p-6 flex-col justify-between shrink-0 font-sans top-16 lg:top-0
      `}>
        <div className="overflow-y-auto hide-scrollbar">
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 rounded-sm flex items-center justify-center">
              <Leaf className="dark:text-emerald-400 text-emerald-600 w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-emerald-400 text-emerald-600">EcoNudge</h1>
          </div>
          
          {user && (
            <div className="mb-8 p-3 bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 rounded-sm shadow-sm transition-colors duration-200">
              <div className="text-sm dark:text-zinc-400 text-zinc-500 mb-1">Logged In As:</div>
              <div className="font-bold text-lg dark:text-zinc-100 text-zinc-900 break-all">
                @{user.username}<span className={`${cursorBlink ? 'opacity-100' : 'opacity-0'} dark:text-emerald-400 text-emerald-600`}>_</span>
              </div>
              <div className="text-xs dark:text-emerald-500 text-emerald-600 mt-2 font-bold">LVL {Math.floor(user.totalXP / 100) || 1} | STREAK: {user.streakCount}</div>
            </div>
          )}

          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                  className={`flex items-center gap-4 px-4 py-3 transition-all duration-300 relative group overflow-hidden border rounded-sm ${
                    isActive 
                      ? 'dark:text-emerald-400 text-emerald-700 dark:bg-zinc-900 bg-emerald-50 dark:border-zinc-800 border-emerald-200 shadow-sm' 
                      : 'dark:text-zinc-400 text-zinc-500 border-transparent hover:dark:text-emerald-400 hover:text-emerald-600 hover:dark:bg-zinc-900 hover:bg-white hover:dark:border-zinc-800 hover:border-zinc-200'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="font-bold relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="space-y-3 mt-6">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 p-3 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 dark:text-zinc-400 text-zinc-600 hover:dark:text-slate-100 hover:text-zinc-900 font-bold transition-colors rounded-sm shadow-sm"
          >
            {theme === 'dark' ? (
              <><Sun className="w-4 h-4" /> Light Mode</>
            ) : (
              <><Moon className="w-4 h-4" /> Dark Mode</>
            )}
          </button>
          <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 p-3 dark:bg-emerald-950/30 bg-emerald-50 border dark:border-emerald-900 border-emerald-200 dark:text-emerald-400 text-emerald-700 hover:dark:bg-emerald-900/50 hover:bg-emerald-100 font-bold transition-colors rounded-sm shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Progress
          </button>
          {user && (
            <button 
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-transparent hover:dark:bg-rose-950/30 hover:bg-rose-50 border border-transparent hover:dark:border-rose-900/50 hover:border-rose-200 dark:text-zinc-500 text-zinc-400 hover:dark:text-rose-400 hover:text-rose-600 font-bold transition-colors rounded-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;

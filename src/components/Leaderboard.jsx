import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, ShieldAlert, Key, PlusSquare, Crown, Lock, Trash2, Loader2 } from 'lucide-react';
import { EcoContext } from '../context/EcoContext';

const Leaderboard = () => {
  const { user, login, logout } = useContext(EcoContext);
  
  // Auth Form State
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [orgKeyInput, setOrgKeyInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('Electronics & Communication Engineering');
  const [customDepartment, setCustomDepartment] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyCopied, setIsKeyCopied] = useState(false);

  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user || !user.orgKey) return;
      try {
        const res = await fetch('/api/leaderboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgKey: user.orgKey })
        });
        if (res.ok) {
          const data = await res.json();
          setLeaderboardData(data);
        }
      } catch {
        // Silently fail on polling — stale data is acceptable, UI is not spammed
      }
    };
    
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const generateRoomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'ENV-';
    for (let i = 0; i < 4; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
    setOrgKeyInput(key);
    navigator.clipboard.writeText(key);
    setIsKeyCopied(true);
    setTimeout(() => setIsKeyCopied(false), 1500);
  };

  const handleAuth = async () => {
    setAuthError('');
    setIsLoading(true);
    
    const finalDepartment = departmentInput === 'Other / Custom...' ? customDepartment : departmentInput;
    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    
    const sanitizedUsername = usernameInput.trim().toLowerCase();
    const sanitizedOrgKey = orgKeyInput.trim().toUpperCase();
    
    const payload = isLoginMode 
      ? { username: sanitizedUsername, password: passwordInput, orgKey: sanitizedOrgKey }
      : { username: sanitizedUsername, password: passwordInput, orgKey: sanitizedOrgKey, department: finalDepartment };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user); // Persists to context and local storage
      } else {
        setAuthError(data.error);
      }
    } catch {
      setAuthError('Connection failure: Ensure you have an active network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account and leaderboard scores?")) return;
    
    try {
      const res = await fetch('/api/user/purge', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      
      if (res.ok) {
        logout();
      } else {
        alert("Failed to delete account");
      }
    } catch (e) {
      alert("System error attempting to delete account.");
    }
  };

  // If not logged in, show the Auth panel
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full max-w-md mx-auto overflow-y-auto hide-scrollbar">
        <div className="bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 p-8 rounded-sm shadow-sm w-full transition-colors duration-200">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-zinc-900 border border-emerald-200 dark:border-zinc-800 rounded-full">
              <Lock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-center text-emerald-600 dark:text-emerald-500 mb-2">
            EcoNudge
          </h1>
          <p 
            className="text-center text-xs text-zinc-600 dark:text-zinc-400 mb-6 px-4 leading-relaxed" 
            style={{ fontFamily: "'Courier New', Courier, monospace", letterSpacing: "0.05em" }}
          >
            An automated behavioral nudging ecosystem for resource management and performance optimization.
          </p>
          <h2 className="text-xl font-bold dark:text-white text-zinc-900 text-center mb-2">
            {isLoginMode ? 'Sign In' : 'Join Community Clash'}
          </h2>
          <p className="text-center dark:text-zinc-500 text-zinc-500 text-sm mb-8">
            {isLoginMode ? 'Welcome back to the grid.' : 'Pool your habits together to lower your collective footprint.'}
          </p>

          <div className="space-y-4 font-sans">
            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Room Key / Org Code</label>
                {!isLoginMode && (
                  <button 
                    onClick={generateRoomKey}
                    className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase hover:underline"
                  >
                    {isKeyCopied ? '[ KEY COPIED! ]' : '[ Create New Room Key ]'}
                  </button>
                )}
              </div>
              <input 
                type="text" 
                value={orgKeyInput}
                onChange={e => setOrgKeyInput(e.target.value.toUpperCase())}
                className="w-full dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-3 rounded-sm outline-none focus:border-emerald-500 text-zinc-800 dark:text-zinc-200 uppercase font-mono transition-colors"
                placeholder="e.g. ENV-742"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-3 rounded-sm outline-none focus:border-emerald-500 text-zinc-800 dark:text-zinc-200 transition-colors font-mono"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Password</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                className="w-full dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-3 rounded-sm outline-none focus:border-emerald-500 text-zinc-800 dark:text-zinc-200 transition-colors font-mono"
                placeholder="••••••••"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Group / Department</label>
                <select 
                  value={departmentInput}
                  onChange={e => setDepartmentInput(e.target.value)}
                  className="w-full dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-3 rounded-sm outline-none text-zinc-800 dark:text-zinc-200 cursor-pointer appearance-none transition-colors"
                >
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Other / Custom...">Other / Custom...</option>
                </select>
              </div>
            )}

            <AnimatePresence>
              {!isLoginMode && departmentInput === 'Other / Custom...' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input 
                    type="text"
                    value={customDepartment}
                    onChange={e => setCustomDepartment(e.target.value)}
                    placeholder="Type your Group or Department name"
                    className="w-full dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 p-3 rounded-sm outline-none focus:border-emerald-500 text-zinc-800 dark:text-zinc-200 transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {authError && <div className="text-rose-500 text-sm font-bold">{authError}</div>}

            <button 
              onClick={handleAuth}
              disabled={isLoading || !usernameInput.trim() || !passwordInput.trim() || (!isLoginMode && !orgKeyInput.trim())}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white dark:text-zinc-950 font-bold py-3 mt-4 rounded-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoginMode ? 'Login' : 'Join Leaderboard'}
            </button>
            
            <div className="text-center mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <button 
                onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }}
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors"
              >
                {isLoginMode ? "Need an account? Sign Up" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <header className="mb-8">
        <motion.h2 
          className="text-2xl font-bold font-mono tracking-tight flex items-center gap-3 dark:text-white text-zinc-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Community Clash <Trophy className="w-6 h-6 text-emerald-500" />
        </motion.h2>
        
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-3xl leading-relaxed">
            Pool your habits together to lower your collective footprint. This leaderboard tracks real-time impact across entire organizations—whether you are competing between university branches, corporate office divisions, neighborhood societies, or custom family groups. Your individual active streaks directly fuel your group's climb to the top.
          </p>
        </motion.div>

        <div className="mt-6 flex items-center gap-2 bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 px-4 py-3 rounded-sm shadow-sm w-fit transition-colors">
          <Key className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Active Org Key:</span>
          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold tracking-widest">{user.orgKey}</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar relative">
        {leaderboardData.length === 0 && (
          <div className="flex items-center justify-center p-6 border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 rounded-sm mt-4">
            <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400 font-bold text-center leading-relaxed">
              📡 SYSTEM_ALERT // This room frequency is completely clear. Be the first to initialize this sector by logging your daily habits above!
            </p>
          </div>
        )}
        
        <AnimatePresence>
          {leaderboardData.map((player, index) => {
            const isMe = player.username === user.username;
            return (
              <motion.div 
                key={player.username}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between p-4 rounded-sm border shadow-sm transition-all relative ${
                  isMe ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'dark:border-zinc-800 border-zinc-200 dark:bg-zinc-950 bg-white'
                }`}
              >
                {isMe && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-emerald-500 rounded-r" />}
                
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-sm flex items-center justify-center font-bold text-lg border ${
                    index === 0 ? 'bg-amber-100 text-amber-600 border-amber-300 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-700/50' : 
                    'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800'
                  }`}>
                    {index === 0 ? <Crown className="w-5 h-5" /> : index + 1}
                  </div>

                  <div className="flex flex-col">
                    <span className={`font-bold text-lg tracking-tight font-sans ${isMe ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      @{player.username}
                    </span>
                    {player.department && <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">{player.department}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className={`font-mono text-2xl font-bold tracking-tighter ${isMe ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-700 dark:text-zinc-300'}`}>
                      {player.totalXP}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mt-1">XP Score</span>
                  </div>
                  
                  {isMe && (
                    <button 
                      onClick={handleDeleteAccount}
                      className="ml-2 flex items-center gap-2 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-sm text-xs font-bold uppercase transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      [ Delete My Account ]
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;

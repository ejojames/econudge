import React, { createContext, useState, useEffect } from 'react';
import { calculateFootprint } from '../utils.js';

export const EcoContext = createContext();

export const EcoProvider = ({ children }) => {
  const getInitialTheme = () => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return 'dark';
    } catch (e) {
      return 'dark';
    }
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Auth State
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('econudge_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('econudge_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('econudge_user');
  };

  const updateXP = async (amount) => {
    if (!user) return;
    const newXP = Math.max(0, user.totalXP + amount);
    const updatedUser = { ...user, totalXP: newXP };
    setUser(updatedUser);
    localStorage.setItem('econudge_user', JSON.stringify(updatedUser));
    
    // Sync to backend silently
    try {
      await fetch('/api/user/sync-streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, xpChange: amount })
      });
    } catch {
      // XP sync is non-critical background operation — fail silently
    }
  };

  // Footprint State
  const [commute, setCommute] = useState(15);
  const [diet, setDiet] = useState(2); // 0: Vegan, 1: Veg, 2: Moderate, 3: Heavy
  const [acUsage, setAcUsage] = useState(6);
  const [flights, setFlights] = useState(0);

  const [totalFootprint, setTotalFootprint] = useState(0);

  useEffect(() => {
    setTotalFootprint(calculateFootprint(commute, diet, acUsage, flights));
  }, [commute, diet, acUsage, flights]);

  return (
    <EcoContext.Provider value={{
      theme, toggleTheme,
      user, login, logout, updateXP,
      commute, setCommute,
      diet, setDiet,
      acUsage, setAcUsage,
      flights, setFlights,
      totalFootprint
    }}>
      {children}
    </EcoContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';

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
      await fetch('http://localhost:5000/api/user/sync-streak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, xpChange: amount })
      });
    } catch (e) {
      console.error('Failed to sync XP');
    }
  };

  // Footprint State
  const [commute, setCommute] = useState(15);
  const [diet, setDiet] = useState(2); // 0: Vegan, 1: Veg, 2: Moderate, 3: Heavy
  const [acUsage, setAcUsage] = useState(6);
  const [flights, setFlights] = useState(0);

  const [totalFootprint, setTotalFootprint] = useState(0);

  // Carbon calculation constants
  const COMMUTE_FACTOR = 0.12 * 365; // kg CO2 per km per year
  const DIET_FACTORS = [1000, 1500, 2500, 3300]; // kg CO2 per year
  const AC_FACTOR = 1.5 * 0.82 * 365; // kg CO2 per hour of AC per year
  const FLIGHT_FACTOR = 250; // kg CO2 per flight

  useEffect(() => {
    const calc = 
      (commute * COMMUTE_FACTOR) + 
      DIET_FACTORS[diet] + 
      (acUsage * AC_FACTOR) + 
      (flights * FLIGHT_FACTOR);
    
    setTotalFootprint(Math.round(calc));
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

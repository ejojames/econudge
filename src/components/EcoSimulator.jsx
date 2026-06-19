import React, { useState, useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { EcoContext } from '../context/EcoContext';
import { Check } from 'lucide-react';

const DOMESTIC_HABITS = [
  { id: 'ac', label: "Set bedroom AC to 24°C or higher", dailySavings: 0.80 },
  { id: 'line_dry', label: "Air-dry or line-dry clothes instead of using a machine tumble dryer", dailySavings: 1.00 },
  { id: 'short_shower', label: "Keep hot geyser showers under 5 minutes (or use a bucket bath)", dailySavings: 1.00 },
  { id: 'food_waste', label: "Finish dinner leftovers completely (Zero Food Waste)", dailySavings: 0.40 },
  { id: 'cold_wash', label: "Wash laundry loads using cold water instead of hot cycles", dailySavings: 0.30 },
  { id: 'blackout', label: "Turn off all lights and fans when leaving an empty room", dailySavings: 0.20 },
  { id: 'phantom', label: "Unplug laptop & phone chargers when devices hit 100%", dailySavings: 0.15 },
  { id: 'eco_stream', label: "Stream video and media in 1080p instead of heavy 4K resolution", dailySavings: 0.10 }
];

const MULTIPLIERS = {
  daily: 1,
  weekly: 7,
  monthly: 30,
  annual: 365
};

function AnimatedCounter({ value }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    motionValue.set(value);
  }, [motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      }
    });
  }, [springValue]);

  return <span ref={ref} />;
}

const EcoSimulator = () => {
  const { updateXP, user } = useContext(EcoContext);
  
  const [timeline, setTimeline] = useState('annual');
  const [activeHabits, setActiveHabits] = useState([]);

  const toggleHabit = useCallback((id) => {
    setActiveHabits(prev => {
      if (prev.includes(id)) {
        updateXP?.(-150);
        return prev.filter(hId => hId !== id);
      } else {
        updateXP?.(150);
        return [...prev, id];
      }
    });
  }, [updateXP]);

  const currentMultiplier = MULTIPLIERS[timeline];
  
  const dailyTotal = useMemo(() => {
    return DOMESTIC_HABITS
      .filter(h => activeHabits.includes(h.id))
      .reduce((acc, curr) => acc + curr.dailySavings, 0);
  }, [activeHabits]);

  const totalSaved = useMemo(() => dailyTotal * currentMultiplier, [dailyTotal, currentMultiplier]);
  
  const colors = useMemo(() => [
    '#e11d48', // 0: Rose red (warning)
    '#d97706', // 1: Amber
    '#eab308', // 2: Yellow
    '#84cc16', // 3: Lime
    '#22c55e', // 4: Green
    '#10b981', // 5: Emerald
    '#059669', // 6: Deep Emerald
    '#047857', // 7: Dark Emerald
    '#064e3b', // 8: Darkest Emerald
  ], []);
  
  const activeColor = useMemo(() => colors[activeHabits.length], [activeHabits.length, colors]);

  return (
    <main className="h-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <header className="mb-8">
        <motion.h2 
          className="text-2xl font-bold dark:text-white text-zinc-900 flex items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Eco-Simulator 
          <span className="text-zinc-400 dark:text-zinc-600 font-mono text-lg ml-3 font-normal">
            // {user?.username || "Guest"}
          </span>
        </motion.h2>
        <motion.p 
          className="dark:text-zinc-500 text-zinc-500 mt-2 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Domestic baseline habit tracking and offset potentials.
        </motion.p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <motion.div 
          className="lg:col-span-7 flex flex-col gap-4 overflow-y-auto pr-2 hide-scrollbar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white dark:bg-zinc-900/40 rounded-sm p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
            
            <div className="flex items-center gap-3 mb-8 w-full overflow-x-auto hide-scrollbar pb-2">
              {['daily', 'weekly', 'monthly', 'annual'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeline(t)}
                  aria-label={`Set timeline to ${t}`}
                  className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-full border whitespace-nowrap ${
                    timeline === t 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-5">
              {DOMESTIC_HABITS.map((habit) => {
                const isChecked = activeHabits.includes(habit.id);
                const habitSaved = (habit.dailySavings * currentMultiplier).toFixed(1);
                
                return (
                  <motion.div 
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Toggle habit: ${habit.label}`}
                    onKeyDown={(e) => { if (e.key === 'Enter') toggleHabit(habit.id); }}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-center justify-between gap-6 p-5 rounded-sm cursor-pointer border transition-all duration-300 shadow-sm ${
                      isChecked 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-500/50' 
                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`shrink-0 w-6 h-6 border rounded-sm flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-emerald-500 border-emerald-500' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {isChecked && <Check className="w-4 h-4 text-white font-bold" />}
                      </div>
                      
                      <p className={`font-sans font-medium text-sm transition-colors ${isChecked ? 'text-emerald-800 dark:text-emerald-200' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {habit.label}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <p className="font-mono text-xs dark:text-emerald-400 text-emerald-600 font-bold tracking-tight">
                        Saves {habitSaved} KG CO₂ / {timeline.toUpperCase()}
                      </p>
                      
                      <div className="h-4 mt-1">
                        <AnimatePresence>
                          {isChecked && (
                            <motion.span
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="font-sans text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400"
                            >
                              +150 XP
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="lg:col-span-5 h-full flex flex-col rounded-sm overflow-hidden relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center min-h-[400px]">
            <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
              {/* Background Circle */}
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle 
                  cx="100" cy="100" r="80" 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-zinc-100 dark:text-zinc-800/50"
                  strokeWidth="12" 
                />
                {/* Animated Foreground Circle */}
                <motion.circle 
                  cx="100" cy="100" r="80" 
                  fill="none" 
                  strokeWidth="12" 
                  strokeLinecap="round"
                  strokeDasharray="502.65"
                  initial={{ strokeDashoffset: 502.65, stroke: colors[0] }}
                  animate={{ 
                    strokeDashoffset: 502.65 - (502.65 * (activeHabits.length / 8)),
                    stroke: activeColor 
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <motion.div 
                  className="text-5xl font-mono font-bold tracking-tighter"
                  animate={{ color: activeColor }}
                >
                  <AnimatedCounter value={totalSaved} />
                </motion.div>
                <span className="text-zinc-500 font-sans text-[10px] mt-2 uppercase tracking-widest font-bold">
                  KG CO₂ / {timeline.toUpperCase()}
                </span>
              </div>
            </div>
            
            <motion.h3 
              className="text-2xl font-bold font-sans tracking-tight mb-4"
              animate={{ color: activeHabits.length === 0 ? '#e11d48' : activeColor }}
            >
              {activeHabits.length === 0 ? 'Critical Vulnerability' : 'Ecosystem Restoring'}
            </motion.h3>
            
            <p className="text-sm dark:text-zinc-400 text-zinc-600 max-w-sm mx-auto font-sans leading-relaxed">
              {activeHabits.length === 0 
                ? 'Your domestic habits are currently taxing the environment. Start tracking changes to lower your footprint.'
                : `You've adopted ${activeHabits.length} domestic habits. Every commitment heals the ecosystem.`}
            </p>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default EcoSimulator;

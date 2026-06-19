import React, { useContext, useState, useEffect } from 'react';
import { EcoContext } from '../context/EcoContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Utensils, ThermometerSun, Plane, TreePine, Leaf, Sprout, Clock, MapPin, Wind, Activity } from 'lucide-react';

const CustomSlider = ({ value, min, max, step = 1, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="relative w-full h-2 rounded-full dark:bg-zinc-800 bg-stone-200 mt-2 mb-3">
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-l-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
      <input 
        type="range" min={min} max={max} step={step} value={value}
        onChange={onChange}
        className="absolute -top-2 left-0 w-full h-6 appearance-none bg-transparent cursor-pointer z-10 
        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.8)] [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
        [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.8)] [&::-moz-range-thumb]:hover:scale-110 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:border-none"
      />
    </div>
  );
};

const Dashboard = () => {
  const { 
    user,
    commute, setCommute, 
    diet, setDiet, 
    acUsage, setAcUsage, 
    flights, setFlights, 
    totalFootprint 
  } = useContext(EcoContext);

  const [city, setCity] = useState("Primary Grid Node");
  const [aqi, setAqi] = useState(85);
  const [cityCo2, setCityCo2] = useState(14500.50);
  const [twitch, setTwitch] = useState(0);

  useEffect(() => {
    const fetchCity = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          if (data.city) {
            setCity(data.city);
          }
        }
      } catch (error) {
        setCity("Primary Grid Node");
      }
    };
    fetchCity();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAqi(prev => {
        const newVal = prev + Math.floor((Math.random() - 0.5) * 5);
        return Math.max(45, Math.min(120, newVal));
      });
      setCityCo2(prev => prev + (Math.random() - 0.5) * 2);
      setTwitch(Math.random());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (value) => {
    if (value > 5000) return 'text-rose-500';
    if (value > 2000) return 'text-amber-500';
    return 'text-emerald-500 dark:text-emerald-400';
  };

  const getDemographicBenchmark = (score) => {
    const safeScore = score || 0;
    if (safeScore <= 1500) return { percentile: 95, tier: "Eco-Guardian", color: "text-emerald-600 dark:text-emerald-400" };
    if (safeScore <= 3000) return { percentile: 75, tier: "Conscious Citizen", color: "text-emerald-600 dark:text-emerald-400" };
    if (safeScore <= 5000) return { percentile: 45, tier: "Moderate Consumer", color: "text-amber-600 dark:text-amber-400" };
    if (safeScore <= 8000) return { percentile: 15, tier: "Heavy Footprint", color: "text-orange-600 dark:text-orange-400" };
    return { percentile: 3, tier: "Climate Critical", color: "text-rose-600 dark:text-rose-500" };
  };

  const dietLabels = ["Vegan", "Vegetarian", "Moderate Meat", "Heavy Meat"];
  const benchmark = getDemographicBenchmark(totalFootprint);
  const safeTotalFootprint = totalFootprint || 0;

  return (
    <div className="h-full flex flex-col font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <header className="mb-8">
        <motion.h2 
          className="text-2xl font-bold dark:text-white text-zinc-900"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Dashboard <span className="text-zinc-400 dark:text-zinc-600 font-mono text-lg ml-2">// {user?.username || "Guest"}</span>
        </motion.h2>
        <motion.p 
          className="dark:text-zinc-500 text-zinc-500 font-normal mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Analyzing baseline carbon metrics...
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        {/* Left Column: Assessment */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2">
          <motion.div 
            className="bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 rounded-sm p-6 shadow-sm transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 dark:text-white text-zinc-900">
              60-Second Onboarding
            </h3>
            
            <div className="space-y-8">
              {/* Commute */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600 font-bold">
                    <Car className="w-4 h-4 dark:text-zinc-500 text-zinc-400" />
                    Daily Commute
                  </label>
                  <span className="dark:text-emerald-400 text-emerald-700 dark:bg-zinc-900 bg-emerald-50 border dark:border-zinc-800 border-emerald-200 px-2 py-1 rounded-sm">{commute} KM</span>
                </div>
                <CustomSlider min="0" max="100" value={commute} onChange={(e) => setCommute(Number(e.target.value))} />
              </div>

              {/* Diet */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600 font-bold">
                    <Utensils className="w-4 h-4 dark:text-zinc-500 text-zinc-400" />
                    Diet Profile
                  </label>
                  <span className="dark:text-emerald-400 text-emerald-700 dark:bg-zinc-900 bg-emerald-50 border dark:border-zinc-800 border-emerald-200 px-2 py-1 rounded-sm">{dietLabels[diet]}</span>
                </div>
                <CustomSlider min="0" max="3" step="1" value={diet} onChange={(e) => setDiet(Number(e.target.value))} />
              </div>

              {/* AC */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600 font-bold">
                    <ThermometerSun className="w-4 h-4 dark:text-zinc-500 text-zinc-400" />
                    AC Usage
                  </label>
                  <span className="dark:text-emerald-400 text-emerald-700 dark:bg-zinc-900 bg-emerald-50 border dark:border-zinc-800 border-emerald-200 px-2 py-1 rounded-sm">{acUsage} HR/DAY</span>
                </div>
                <CustomSlider min="0" max="24" value={acUsage} onChange={(e) => setAcUsage(Number(e.target.value))} />
              </div>

              {/* Flights */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 dark:text-zinc-400 text-zinc-600 font-bold">
                    <Plane className="w-4 h-4 dark:text-zinc-500 text-zinc-400" />
                    Flights / Year
                  </label>
                  <span className="dark:text-emerald-400 text-emerald-700 dark:bg-zinc-900 bg-emerald-50 border dark:border-zinc-800 border-emerald-200 px-2 py-1 rounded-sm">{flights} FLIGHTS</span>
                </div>
                <CustomSlider min="0" max="15" value={flights} onChange={(e) => setFlights(Number(e.target.value))} />
              </div>
            </div>
          </motion.div>

          {/* Real-Time Telemetry Widget */}
          <motion.div 
            className="bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 rounded-sm p-6 shadow-sm transition-colors duration-200 relative overflow-hidden group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 dark:from-emerald-500/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 bg-emerald-500 rounded-full"></span>
                </span>
                <h3 className="text-xs font-bold dark:text-emerald-400 text-emerald-600 tracking-wider uppercase flex items-center gap-2">
                  {city === "Primary Grid Node" ? "LOCAL TELEMETRY" : "Live Regional Emission Telemetry"} <span className="text-zinc-400 dark:text-zinc-600">//</span> {city}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <Wind className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold dark:text-zinc-500 text-zinc-500 tracking-widest">Ambient AQI</span>
                  </div>
                  <span className="text-xl font-bold dark:text-slate-200 text-zinc-800">{aqi}</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <Activity className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold dark:text-zinc-500 text-zinc-500 tracking-widest">Daily Output</span>
                  </div>
                  <span className="text-xl font-bold dark:text-slate-200 text-zinc-800">{cityCo2.toFixed(1)}<span className="text-xs font-normal dark:text-zinc-500 text-zinc-400 ml-1">MT</span></span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 dark:text-zinc-500 text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold dark:text-zinc-500 text-zinc-500 tracking-widest">Real-Time Data</span>
                  </div>
                  <span className="text-xl font-bold dark:text-emerald-400 text-emerald-600 font-mono tracking-tighter">
                    {twitch.toFixed(4).substring(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Reality Check */}
        <div className="flex flex-col gap-6 h-full">
          {/* Main Score Card */}
          <motion.div 
            className="bg-white dark:bg-emerald-950/10 border border-zinc-200 dark:border-emerald-500/20 p-8 flex flex-col items-center justify-center text-center rounded-sm shadow-sm transition-colors duration-200"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold dark:text-zinc-500 text-zinc-400 mb-4 uppercase tracking-wider">Estimated Annual Footprint</h3>
            
            <motion.div
              key={benchmark.tier}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`px-4 py-1 border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900 bg-zinc-50 rounded-sm text-xs font-bold uppercase tracking-wider mb-2 ${benchmark.color}`}
            >
              {benchmark.tier}
            </motion.div>

            <div className="flex items-baseline gap-2 mb-4 mt-2">
              <span className={`text-6xl font-bold tracking-tighter ${getSeverityColor(safeTotalFootprint)}`}>
                {safeTotalFootprint.toLocaleString()}
              </span>
              <span className="text-xl dark:text-zinc-600 text-zinc-400 font-bold">KG CO₂</span>
            </div>
            
            <motion.p 
              key={benchmark.percentile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm dark:text-zinc-400 text-zinc-500 font-normal max-w-md"
            >
              Your choices are cleaner than <span className={`font-bold ${benchmark.color}`}>{benchmark.percentile}%</span> of the urban population.
            </motion.p>
          </motion.div>

          {/* Equivalents Grid */}
          <div className="grid grid-cols-2 gap-4 flex-1">
            <motion.div 
              className="bg-white dark:bg-emerald-950/10 rounded-sm border border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 p-5 flex flex-col justify-center group shadow-sm" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-sm group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 transition-colors">
                  <TreePine className="w-5 h-5 dark:text-zinc-400 text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-xs font-bold dark:text-zinc-500 text-zinc-500 uppercase tracking-wider">Canopy Loss</span>
              </div>
              <p className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">
                {(safeTotalFootprint / 5).toLocaleString(undefined, {maximumFractionDigits: 1})} <span className="text-sm font-normal dark:text-zinc-500 text-zinc-400">sq.m</span>
              </p>
              <p className="text-[10px] dark:text-zinc-600 text-zinc-400 font-normal mt-1 uppercase">Himalayan density compromised</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-emerald-950/10 rounded-sm border border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 p-5 flex flex-col justify-center group shadow-sm" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-sm group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 transition-colors">
                  <Leaf className="w-5 h-5 dark:text-zinc-400 text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-xs font-bold dark:text-zinc-500 text-zinc-500 uppercase tracking-wider">Mangrove Disrupt</span>
              </div>
              <p className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">
                {(safeTotalFootprint / 25).toLocaleString(undefined, {maximumFractionDigits: 1})} <span className="text-sm font-normal dark:text-zinc-500 text-zinc-400">units</span>
              </p>
              <p className="text-[10px] dark:text-zinc-600 text-zinc-400 font-normal mt-1 uppercase">Sapling capture negated</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-emerald-950/10 rounded-sm border border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 p-5 flex flex-col justify-center group shadow-sm" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-sm group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 transition-colors">
                  <Sprout className="w-5 h-5 dark:text-zinc-400 text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-xs font-bold dark:text-zinc-500 text-zinc-500 uppercase tracking-wider">Soil Depletion</span>
              </div>
              <p className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">
                {(safeTotalFootprint / 100).toLocaleString(undefined, {maximumFractionDigits: 2})} <span className="text-sm font-normal dark:text-zinc-500 text-zinc-400">ha</span>
              </p>
              <p className="text-[10px] dark:text-zinc-600 text-zinc-400 font-normal mt-1 uppercase">Biological layer neutralized</p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-emerald-950/10 rounded-sm border border-zinc-200 dark:border-emerald-500/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-colors duration-200 p-5 flex flex-col justify-center group shadow-sm" 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 dark:bg-zinc-900 bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-sm group-hover:border-emerald-300 dark:group-hover:border-emerald-500/50 transition-colors">
                  <Clock className="w-5 h-5 dark:text-zinc-400 text-zinc-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-xs font-bold dark:text-zinc-500 text-zinc-500 uppercase tracking-wider">Recovery Clock</span>
              </div>
              <p className="text-2xl font-bold dark:text-emerald-400 text-emerald-600">
                {(safeTotalFootprint / 500).toLocaleString(undefined, {maximumFractionDigits: 1})} <span className="text-sm font-normal dark:text-zinc-500 text-zinc-400">yrs</span>
              </p>
              <p className="text-[10px] dark:text-zinc-600 text-zinc-400 font-normal mt-1 uppercase">Isolation needed to restore</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


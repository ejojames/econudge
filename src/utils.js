// Carbon calculation constants
export const COMMUTE_FACTOR = 0.12 * 365; // kg CO2 per km per year
export const DIET_FACTORS = [1000, 1500, 2500, 3300]; // kg CO2 per year
export const AC_FACTOR = 1.5 * 0.82 * 365; // kg CO2 per hour of AC per year
export const FLIGHT_FACTOR = 250; // kg CO2 per flight

/**
 * Mathematically computes the total annual carbon footprint based on core lifestyle slider values.
 *
 * @param {number} commute - Daily commute in km.
 * @param {number} diet - Diet index (0: Vegan, 1: Veg, 2: Moderate, 3: Heavy).
 * @param {number} acUsage - AC usage in hours per day.
 * @param {number} flights - Number of flights per year.
 * @returns {number} The rounded total footprint in kg CO2.
 */
export const calculateFootprint = (commute, diet, acUsage, flights) => {
  const calc = 
    (commute * COMMUTE_FACTOR) + 
    DIET_FACTORS[diet] + 
    (acUsage * AC_FACTOR) + 
    (flights * FLIGHT_FACTOR);
  
  return Math.round(calc);
};

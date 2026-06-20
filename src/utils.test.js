import { describe, it, expect } from 'vitest';
import { calculateFootprint } from './utils.js';

describe('Carbon Footprint Scoring Mathematics', () => {
  it('computes accurate values for a vegan with low commute and AC usage', () => {
    // commute: 5km, diet: 0 (Vegan), acUsage: 2hrs, flights: 0
    const footprint = calculateFootprint(5, 0, 2, 0);
    // 5 * (0.12 * 365) + 1000 + 2 * (1.5 * 0.82 * 365) + 0
    // 5 * 43.8 = 219
    // 1000
    // 2 * 448.95 = 897.9
    // Total = 219 + 1000 + 897.9 = 2116.9 => 2117
    expect(footprint).toBe(2117);
  });

  it('computes accurate values for a heavy meat eater with high flights', () => {
    // commute: 50km, diet: 3 (Heavy Meat), acUsage: 12hrs, flights: 5
    const footprint = calculateFootprint(50, 3, 12, 5);
    // 50 * 43.8 = 2190
    // 3300
    // 12 * 448.95 = 5387.4
    // 5 * 250 = 1250
    // Total = 2190 + 3300 + 5387.4 + 1250 = 12127.4 => 12127
    expect(footprint).toBe(12127);
  });
});

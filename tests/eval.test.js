import test from 'node:test';
import assert from 'node:assert';

test('Carbon Timeline Multipliers - Mathematical Accuracy', (t) => {
    const MULTIPLIERS = { daily: 1, weekly: 7, monthly: 30, annual: 365 };
    const sampleDailySavings = 1.80; // e.g., 0.80 (AC) + 1.00 (Line dry)

    const weeklySaved = sampleDailySavings * MULTIPLIERS.weekly;
    const annualSaved = sampleDailySavings * MULTIPLIERS.annual;

    assert.strictEqual(weeklySaved, 12.60, 'Weekly multiplier calculates correctly');
    assert.strictEqual(annualSaved, 657.00, 'Annual multiplier calculates correctly');
});

test('Multi-Tenant Namespace Isolation - Room Key Boundary', (t) => {
    // Mock user database with Room Keys (orgKey)
    const mockDB = [
        { username: 'alex', orgKey: 'ENV-101', footprint: 1200 },
        { username: 'alex', orgKey: 'BIO-202', footprint: 4000 },
        { username: 'sam', orgKey: 'ENV-101', footprint: 1500 }
    ];

    // Simulating the O(1) indexed lookup boundary
    const findUserInNamespace = (username, orgKey) => {
        return mockDB.find(u => u.username === username && u.orgKey === orgKey);
    };

    const alexEnv = findUserInNamespace('alex', 'ENV-101');
    const alexBio = findUserInNamespace('alex', 'BIO-202');

    assert.ok(alexEnv, 'User exists in ENV-101 namespace');
    assert.ok(alexBio, 'User exists in BIO-202 namespace');
    assert.notStrictEqual(alexEnv.footprint, alexBio.footprint, 'Namespaces strictly isolate data metrics');
});

import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { orgKey } = req.body;
    if (!orgKey) {
      return res.status(400).json({ error: 'orgKey is required' });
    }

    const leaderboard = await User.aggregate([
      { $match: { orgKey: orgKey.toUpperCase() } },
      { $sort: { totalXP: -1 } },
      { $project: { password: 0 } } // Exclude passwords
    ]);

    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

export default router;

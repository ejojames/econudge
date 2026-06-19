import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/sync-streak', async (req, res) => {
  try {
    const { userId, xpChange } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const now = new Date();
    const lastActive = new Date(user.lastActiveDate);
    
    // Reset time to midnight for exact day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

    const diffTime = Math.abs(today - lastActiveDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streakCount += 1;
    } else if (diffDays > 1) {
      user.streakCount = 1;
    }
    
    // If diffDays === 0, same day, don't change streak

    user.lastActiveDate = now;
    
    if (xpChange) {
        user.totalXP = Math.max(0, user.totalXP + xpChange);
    }

    const updatedUser = await user.save();

    res.json({
      totalXP: updatedUser.totalXP,
      streakCount: updatedUser.streakCount
    });
  } catch (error) {
    console.error('Sync streak error:', error);
    res.status(500).json({ error: 'Server error syncing streak' });
  }
});

router.delete('/purge', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    console.error('Purge error:', error);
    res.status(500).json({ error: 'Server error purging user' });
  }
});

export default router;

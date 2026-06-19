import express from 'express';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route POST /api/user/sync-streak
 * @desc Synchronizes the user's active daily streak and updates total XP securely.
 * @access Private (JWT expected, simplified for demo)
 * @efficiency O(1) - Indexed lookup via native MongoDB _id parameter
 */
router.post('/sync-streak', async (req, res) => {
  try {
    const { userId, xpChange } = req.body;
    
    // Explicit Type Validation (Security)
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Valid string User ID required' });
    }
    if (xpChange !== undefined && typeof xpChange !== 'number') {
      return res.status(400).json({ error: 'xpChange must be a valid integer' });
    }

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

/**
 * @route DELETE /api/user/purge
 * @desc Permanently deletes a user record and their footprint data from the Carbon Tracking Ecosystem.
 * @access Private
 * @efficiency O(1) - Direct indexed deletion via _id
 */
router.delete('/purge', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Explicit Type Validation
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Valid string User ID required' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ success: true, message: 'User permanently deleted' });
  } catch (error) {
    console.error('Purge error:', error);
    res.status(500).json({ error: 'Server error purging user' });
  }
});

export default router;

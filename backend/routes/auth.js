import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Registers a new user into the Carbon Tracking Ecosystem.
 * @access Public
 * @efficiency O(1) - Indexed lookup via orgKey for Multi-Tenant Namespace Isolation
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password, orgKey, department } = req.body;

    if (!username || !password || !orgKey || !department) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Explicit Type Validation (Security)
    if (typeof username !== 'string' || typeof password !== 'string' || typeof orgKey !== 'string' || typeof department !== 'string') {
      return res.status(400).json({ error: 'All fields must be valid strings' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanOrgKey = orgKey.trim().toUpperCase();

    if (/\s/.test(cleanUsername)) {
      return res.status(400).json({ error: 'Username cannot contain spaces' });
    }

    const existingUser = await User.findOne({ username: cleanUsername, orgKey: cleanOrgKey });
    if (existingUser) {
      return res.status(400).json({ error: 'This username is already taken inside this room grid.' });
    }

    const newUser = new User({
      username: cleanUsername,
      password,
      orgKey: cleanOrgKey,
      department
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        orgKey: savedUser.orgKey,
        department: savedUser.department,
        totalXP: savedUser.totalXP,
        streakCount: savedUser.streakCount
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'MongoTimeoutError' || error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ error: 'Database timeout: Connection failed' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username already exists (Duplicate Key)' });
    }
    
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticates a user into their isolated Room Key namespace.
 * @access Public
 * @efficiency O(1) - Compound indexed lookup via { username, orgKey }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password, orgKey } = req.body;

    if (!username || !password || !orgKey) {
      return res.status(400).json({ error: 'Please provide username, password, and org key' });
    }

    // Explicit Type Validation (Security)
    if (typeof username !== 'string' || typeof password !== 'string' || typeof orgKey !== 'string') {
      return res.status(400).json({ error: 'All fields must be valid strings' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanOrgKey = orgKey.trim().toUpperCase();

    const user = await User.findOne({ username: cleanUsername, orgKey: cleanOrgKey });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        orgKey: user.orgKey,
        department: user.department,
        totalXP: user.totalXP,
        streakCount: user.streakCount
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error.name === 'MongoTimeoutError' || error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ error: 'Database timeout: Connection failed' });
    }
    
    res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\S+$/.test(v); // Zero spaces
      },
      message: props => `${props.value} contains spaces!`
    }
  },
  password: {
    type: String,
    required: true
  },
  orgKey: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  totalXP: {
    type: Number,
    default: 350
  },
  streakCount: {
    type: Number,
    default: 1
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ username: 1, orgKey: 1 }, { unique: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

export default mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Invite code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  role: {
    type: String,
    enum: ['admin', 'employee', 'user'],
    default: 'employee'
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  used: {
    type: Boolean,
    default: false
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

// Check if invite is valid
inviteSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date();
};

module.exports = mongoose.model('Invite', inviteSchema);

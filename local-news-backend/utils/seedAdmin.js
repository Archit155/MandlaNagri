const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Seed a default admin user if it does not already exist.
 * Uses ADMIN_EMAIL and ADMIN_PASSWORD from environment variables.
 */
const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set – skipping admin seed');
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.info('✅  Admin user already exists. Updating password from env var for safety.');
    existing.password = password; // pre-save hook will hash this plain text
    await existing.save();
    return;
  }

  const admin = new User({
    name: 'Site Administrator',
    email,
    password, // pre-save hook will hash this plain text
    role: 'admin',
    googleId: null,
  });

  await admin.save();
  console.info('🛠️  Admin user created');
};

module.exports = seedAdmin;

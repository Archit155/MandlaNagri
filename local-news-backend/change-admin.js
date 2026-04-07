require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const changeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const admin = await User.findOne({ email: 'admin@localnews.com' });
    if (admin) {
      admin.email = 'architchoubey015@gmail.com';
      admin.password = '724704';
      await admin.save();
      console.log('✅ Admin updated successfully!');
    } else {
      console.log('Admin not found, creating new admin account...');
      await User.create({
        name: 'Super Admin',
        email: 'architchoubey015@gmail.com',
        password: '724704',
        role: 'admin'
      });
      console.log('✅ Admin created successfully!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Failed to change admin:', err);
    process.exit(1);
  }
};

changeAdmin();

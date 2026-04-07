require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const categories = [
  { name: 'Politics' },
  { name: 'Sports' },
  { name: 'Community' },
  { name: 'Education' },
  { name: 'Events' },
  { name: 'Technology' },
  { name: 'Local' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing categories
    await Category.deleteMany();
    console.log('Existing categories cleared.');

    // Insert new categories one by one to trigger pre-save hooks
    for (const cat of categories) {
      await Category.create(cat);
    }
    console.log('Categories seeded successfully!');

    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

seedCategories();

const Category = require('../models/Category');

/**
 * Seed default categories if none exist in the database.
 */
const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    
    if (count > 0) {
      console.info('✅  Categories already exist');
      return;
    }

    const defaultCategories = [
      { name: 'News' },
      { name: 'Sports' },
      { name: 'Politics' },
      { name: 'Business' },
      { name: 'Lifestyle' }
    ];

    await Category.insertMany(defaultCategories);
    console.info('🛠️  Default categories seeded: News, Sports, Politics, Business, Lifestyle');
  } catch (err) {
    console.error('❌  Category seed error:', err.message);
  }
};

module.exports = seedCategories;

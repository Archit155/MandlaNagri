require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Invite = require('./models/Invite');

const seedData = async () => {
  try {
    console.log('Connecting to Local MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    // 1. Create Admin Account
    const adminEmail = 'admin@localnews.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: 'Password123!', 
        role: 'admin'
      });
      console.log('✅ Admin account created:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: Password123!`);
    } else {
      console.log('⚠️ Admin account already exists. Skipping creation.');
    }

    // 2. Clear standard collections if empty to ensure initial data
    const existingCats = await Category.countDocuments();
    if (existingCats === 0) {
      const standardCategories = [
        { name: 'Politics' },
        { name: 'Sports' },
        { name: 'Community' },
        { name: 'Education' },
        { name: 'Business' }
      ];
      await Category.insertMany(standardCategories);
      console.log('✅ Seeded default categories');
    } else {
      console.log('⚠️ Categories exist. Skipping creation.');
    }

    // 3. Create initial Employee Invite
    const existingInvite = await Invite.countDocuments();
    if (existingInvite === 0) {
      const invite = await Invite.create({
        code: 'WELCOME2026',
        role: 'employee',
        // Expires 1 year from now
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      });
      console.log('✅ Created starter employee invite:');
      console.log(`   Invite Code: ${invite.code}`);
      console.log(`   Role: ${invite.role}`);
    } else {
       console.log('⚠️ Invite exists. Skipping creation.');
    }

    // 4. Seed Demo Articles
    const Article = require('./models/Article');
    console.log('🗑️ Clearing existing articles for fresh demo data...');
    await Article.deleteMany({});
    
    const demoArticles = [
      {
        title: 'Local High School Wins State Championship',
        content: 'In a thrilling final match that kept fans on the edge of their seats, our local high school team secured the state championship title today. The community is celebrating this historic victory with a parade planned for next Saturday. Coaches and players alike credit the win to months of grueling practice and a strong sense of teamwork that bond them more like family than just teammates.',
        category: 'Sports',
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=1000&auto=format&fit=crop',
        author: admin._id,
        status: 'published'
      },
      {
        title: 'New Community Center Opening This Weekend',
        content: 'The long-awaited downtown community center is finally opening its doors this Saturday. Residents are invited to explore the new facilities, which include a public library branch, a modern gym, and a youth innovation hub. The project, funded by both local grants and private donations, aims to provide a safe and inclusive space for all age groups to learn, exercise, and socialize in the heart of our city.',
        category: 'Community',
        image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1000&auto=format&fit=crop',
        author: admin._id,
        status: 'published'
      },
      {
        title: 'City Council Approves New Green Energy Initiative',
        content: 'Last night, the city council voted unanimously to approve a major expansion of our local solar energy grid. This multi-million dollar initiative is expected to reduce the city\'s carbon footprint by 30% over the next five years while creating hundreds of green-tech jobs. Mayor Sarah Jenkins stated that this is a "huge leap forward for our sustainable future," emphasizing the long-term economic and environmental benefits for every resident.',
        category: 'Politics',
        image: 'https://images.unsplash.com/photo-1466611668255-139f5629c502?q=80&w=1000&auto=format&fit=crop',
        author: admin._id,
        status: 'published'
      },
      {
        title: 'Tech Startup Boom in Innovation District',
        content: 'Three new technology startups have announced their move into the city\'s recently renovated Innovation District this week. These companies, focusing on AI-driven education and sustainable farming technologies, are expected to bring over 500 high-paying roles to the area. The local chamber of commerce expects this influx of talent to further boost the surrounding retail and restaurant sectors, solidifying our city as a regional hub for future-forward businesses.',
        category: 'Business',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop',
        author: admin._id,
        status: 'published'
      }
    ];
    await Article.insertMany(demoArticles);
    console.log('✅ Seeded demo articles');

    console.log('Seeding Complete! Quitting...');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed:', err);
    process.exit(1);
  }
};

seedData();

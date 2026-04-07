const mongoose = require('mongoose');
const User = require('./models/User');
const Article = require('./models/Article');
const Category = require('./models/Category');
const Invite = require('./models/Invite');

const LOCAL_URI = 'mongodb://localhost:27017/local-news';
const ATLAS_URI = 'mongodb+srv://architchoubey015_db_user:bN8BSpBHCA6ppiPY@cluster0.3pdzptq.mongodb.net/local-news?appName=Cluster0';

async function migrate() {
  let localDb, atlasDb;
  try {
    console.log('🔗 Connecting to Source (Local MongoDB)...');
    localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to Local DB');

    console.log('🔗 Connecting to Target (Atlas MongoDB)...');
    atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to Atlas DB');

    // Setup Models for Local
    const LocalUser = localDb.model('User', User.schema);
    const LocalArticle = localDb.model('Article', Article.schema);
    const LocalCategory = localDb.model('Category', Category.schema);
    const LocalInvite = localDb.model('Invite', Invite.schema);

    // Setup Models for Atlas
    const AtlasUser = atlasDb.model('User', User.schema);
    const AtlasArticle = atlasDb.model('Article', Article.schema);
    const AtlasCategory = atlasDb.model('Category', Category.schema);
    const AtlasInvite = atlasDb.model('Invite', Invite.schema);

    console.log('\n📦 Fetching local data...');
    const users = await LocalUser.find().select('+password').lean();
    const articles = await LocalArticle.find().lean();
    const categories = await LocalCategory.find().lean();
    const invites = await LocalInvite.find().lean();

    console.log(`Found: ${users.length} Users, ${articles.length} Articles, ${categories.length} Categories, ${invites.length} Invites`);

    console.log('\n🚀 Starting Transfer to Atlas...');
    
    // Clear targeted Atlas collections first to prevent duplicate key errors if already seeded
    await AtlasUser.deleteMany({});
    await AtlasArticle.deleteMany({});
    await AtlasCategory.deleteMany({});
    await AtlasInvite.deleteMany({});

    if(users.length > 0) await AtlasUser.insertMany(users);
    console.log('✔️ Users Transferred');

    if(categories.length > 0) await AtlasCategory.insertMany(categories);
    console.log('✔️ Categories Transferred');

    if(articles.length > 0) await AtlasArticle.insertMany(articles);
    console.log('✔️ Articles Transferred');

    if(invites.length > 0) await AtlasInvite.insertMany(invites);
    console.log('✔️ Invites Transferred');

    console.log('\n🎉 Database successfully deployed to MongoDB Atlas!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
  } finally {
    if (localDb) await localDb.close();
    if (atlasDb) await atlasDb.close();
    process.exit(0);
  }
}

migrate();

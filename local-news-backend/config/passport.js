const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    proxy: true // trust proxies (useful for heroku/production)
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const googleId = profile.id;
      const name = profile.displayName;

      // 1. Check if user with this googleId exists
      let user = await User.findOne({ googleId });
      if (user) return done(null, user);

      // 2. Check if user with this email exists (and link googleId)
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        await user.save();
        return done(null, user);
      }

      // 3. Create new user if not found
      user = await User.create({
        name,
        email,
        googleId,
        role: 'user' // default role for social registrants
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// Simple serialization (we use JWT, but passport requires this)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

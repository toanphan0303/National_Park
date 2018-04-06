const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const keys = require('../../config/keys')

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) =>{
    const existingUser = await User.findOne({googleId: profile.id})
    if(existingUser){
      return done(null, existingUser)
    } else{
      let name = profile.displayName.split(" ")
      const firstName = name[0]
      const lastName = name[1]
      const user = await new User({googleId: profile.id, avatar: profile.photos[0].value, email:profile.emails[0].value}).save()
      done(null, user)
    }
  })
)

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.use(
  new GoogleStrategy({
    clientID: '934715185016-mseglhk5gc2n0fsilhlpbmhdd3es9763.apps.googleusercontent.com',
    clientSecret: 'wwS7CB0H_DpHWmIC4ufK7vrG',
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) =>{
    const existingUser = await User.findOne({googleId: profile.id})
    if(existingUser){
      return done(null, existingUser)
    } else{
      const user = await new User({googleId: profile.id, avatar: profile.photos[0].value, email:profile.emails[0].value}).save()
      done(null, user)
    }
  })
)

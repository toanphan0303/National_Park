const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
const keys = require('../../config/keys')
passport.use(
  new FacebookStrategy({
    clientID: keys.fbClientID,
    clientSecret: keys.fbClientSecrete,
    callbackURL: '/auth/fb/callback',
    proxy: true,
    enableProof: true,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  async (accessToken, refreshToken, profile, done) =>{
    const existingUser = await User.findOne({facebookId: profile.id})
    if(existingUser){
      return done(null, existingUser)
    } else{
      let name = profile.displayName.split(" ")
      const firstName = name[0]
      const lastName = name[1]
      const user = await new User({facebookId: profile.id, avatar: profile.photos[0].value, firstName, lastName}).save()
      done(null, user)
    }
  })
)

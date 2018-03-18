const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.use(
  new FacebookStrategy({
    clientID: '1900907360199847',
    clientSecret: '44549618ac19472478c131353f9ec250',
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
      const user = await new User({facebookId: profile.id, avatar: profile.photos[0].value}).save()
      done(null, user)
    }
  })
)

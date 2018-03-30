const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  avatar:String,
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'trip'
  }],
});

UserSchema.pre('save', function save(next){
  const user = this;
  if(!user.isModified('password')){
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {return next(err);}
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) { return next(err); }
      user.password = hash;
      next();
    })
  })
})
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) =>{
    cb(err, isMatch)
  })
}

UserSchema.statics.findTrips = function(id){
  return this.findById(id)
    .populate('trips')
    .then(user => user.trips)
}
UserSchema.statics.deleteTrip = function(id, tripId){
  return this.findById(id, (err, user) =>{
    console.log(user)
    console.log(tripId)
    user.trips.remove({_id : tripId})
    user.save((err) => {
      if(err){
        console.error('ERROR')
      }
    })
    return user.populate
  })

}

mongoose.model('user', UserSchema)

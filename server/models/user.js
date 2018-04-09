const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const UserSchema = new Schema({
  email: String,
  password: String,
  googleId: String,
  facebookId: String,
  firstName: String,
  lastName: String,
  avatar:String,
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'trip'
  }],
  comments:[{
    type: Schema.Types.ObjectId,
    ref: 'comment'
  }],
  rates:[{
    type: Schema.Types.ObjectId,
    ref: 'rated'
  }]
});
UserSchema.plugin(timestamps);
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
UserSchema.statics.ratedTrip = async function(userId, tripId, value){
  const Trip = mongoose.model('trip')
  const Rated = mongoose.model('rated')
  const rateObj = await new Rated({user:userId, trip:tripId, rated: value}).save()
  await Trip.update({_id:tripId}, {$push: {rates: rateObj}})
  return await this.update({_id: userId},
    {$push:{rates: rateObj }})
}
UserSchema.statics.findTrips = function(id){
  return this.findById(id)
    .populate('trips')
    .then(user => user.trips)
}
UserSchema.statics.findComments = function(id){
  return this.findById(id)
    .populate('comments')
    .then(user => user.comments)
}
UserSchema.statics.findRates = function(id){
  return this.findById(id)
    .populate('rates')
    .then(user => user.rates)
}

UserSchema.statics.deleteTrip = function(id, tripId){
  return this.findById(id, (err, user) =>{
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

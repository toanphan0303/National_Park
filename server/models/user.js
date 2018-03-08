const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: String,
  password: String,
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'trip'
  }],
});

UserSchema.pre('save', function save(next){
  const user = this;
  console.log(user)
  if(!user.isModified('password')){
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if(err) {return next(err);}
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) { return next(err); }
      console.log(hash)
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

mongoose.model('user', UserSchema)

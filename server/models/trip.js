const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const _ = require('lodash')
const TripSchema = new Schema({
  title: {type: String},
  tripImage: {type: String},
  tripPoints: [{
    type: Schema.Types.ObjectId,
    ref: 'trippoint'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  park: {
    type: Schema.Types.ObjectId,
    ref: 'park'
  },
  comments:[
      {
          type: Schema.Types.ObjectId,
          ref: "comment"
      }
  ]
})
TripSchema.plugin(timestamps);
TripSchema.statics.addTripPoint = function(tripId, tripPointId){

  return this.findById(tripId)
    .then(trip => {
      trip.tripPoints.push(tripPointId)
      trip.save()
      return trip.populate()
    })
}
TripSchema.statics.addTrip = async function(user, title, tripImage, park){
  const User = mongoose.model('user')
  const userObj= await User.findById(user)
  return new this({user, title, tripImage, park}).save()
    .then(trip => {
      userObj.trips.push(trip)
      userObj.save((err) => {
        if(err){
          console.error('ERROR')
        }
      })
      return trip.populate()
    })
}
TripSchema.statics.findTripPoints = function(id){
  return this.findById(id)
    .populate('tripPoints')
    .then(trip => trip.tripPoints)
}
TripSchema.statics.findComments = function(id){
  return this.findById(id)
    .populate('comments')
    .then(trip => trip.comments)
}
TripSchema.statics.orderPointsInTrip = function(tripId, pointOrder){
  return this.update({"_id":tripId}, {"$set":{tripPoints: pointOrder}})
    .then(result => this.findById(tripId)
      .then(trip => trip.populate())
  )
}
TripSchema.statics.obmitPointFromTrip = function(tripId, pointId){
  return this.findById(tripId, (err, trip) =>{
    trip.tripPoints.remove({_id:pointId})
    trip.save((err) => {
      if(err){
        console.error('ERROR')
      }
    })
    return trip.populate
  })
}
TripSchema.statics.addCommentToTrip = function(tripId, userId, content){
  const Comment = mongoose.model('comment')
  const User = mongoose.model('user')
  return this.findById(tripId)
    .then(async trip =>{
      const commentObj = new Comment({content, user:userId, trip:tripId})
      trip.comments.push(commentObj)
      const user = await User.findById(userId)
      user.comments.push(commentObj)
      return Promise.all([commentObj.save(), trip.save(), user.save()])
        .then(([commentObj, trip]) => trip)
    })
}

mongoose.model('trip', TripSchema)

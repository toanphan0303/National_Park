const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const noteSchema = require('./note')
const TripPointSchema = new Schema({
  image:{ type: [String]},
  video:{ type: [String]},
  note: { type: [String]},
  activitylocation: {
    type: Schema.Types.ObjectId,
    ref: 'activitylocation'
  }
})

TripPointSchema.statics.addLocation = async function(tripPointId, activitylocationId){
  const Activitylocation = mongoose.model('activitylocation')
  const ActLocObject = await Activitylocation.findById(activitylocationId)
  return this.findOne({_id:tripPointId}, (err, tripPoint) => {
      tripPoint.activitylocation =ActLocObject._id;
      tripPoint.save( (err) => {
        if(err){
          console.error('ERROR')
        }
        return tripPoint
      })
  })
}
TripPointSchema.statics.findActivityLocation = function(id){
  return this.findById(id)
    .populate('activitylocation')
    .then((TripPoint) => {
      return TripPoint.activitylocation
    })
}
TripPointSchema.statics.addImageUrl = function(id, imgUrl){
  return this.update({"_id": id},
    {$pushAll: {image: imgUrl}},
    {upsert:true}, ((err) => {
      if(err){console.error(err)}
      else{
      console.log("successfule add image Url to Trip Point")
      return id
    }})
  )
}

mongoose.model('trippoint', TripPointSchema)

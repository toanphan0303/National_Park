const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TripPointSchema = new Schema({
  images:[{
    type: Schema.Types.ObjectId,
    ref: 'image'
  }],
  videos:[{
    type: Schema.Types.ObjectId,
    ref: 'video'
  }],
  note:{
    type: Schema.Types.ObjectId,
    ref: 'note'
  },
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
TripPointSchema.statics.findImages = function(id){
  return this.findById(id)
    .populate('images')
    .then((TripPoint) => {
      return TripPoint.images
    })
}
TripPointSchema.statics.findVideos = function(id){
  return this.findById(id)
    .populate('videos')
    .then((TripPoint) => {
      return TripPoint.videos
    })
}
TripPointSchema.statics.findNote = function(id){
  return this.findById(id)
    .populate('note')
    .then((TripPoint) => {
      return TripPoint.note
    })
}

TripPointSchema.statics.addImage = function(id, title, url){
  const Image = mongoose.model('image')
  return this.findById(id)
    .then(TripPoint =>{
      const imageObj = new Image({title, url})
      TripPoint.images.push(imageObj)
      return Promise.all([imageObj.save(), TripPoint.save()])
        .then(([imageObj, TripPoint]) => TripPoint)
    })
}
TripPointSchema.statics.addVideo = function(id, title, url){
  const Video = mongoose.model('video')
  return this.findById(id)
    .then(TripPoint =>{
      const videoObj = new Video({title, url})
      TripPoint.videos.push(videoObj)
      return Promise.all([imageObj.save(), TripPoint.save()])
        .then(([videoObj, TripPoint]) => TripPoint)
    })
}
TripPointSchema.statics.addNote = function(id,title, content){
  const Note = mongoose.model('note')
  return this.findById(id)
    .then(TripPoint =>{
      const noteObj = new Note({title, content})
      TripPoint.note = noteObj
      return Promise.all([noteObj.save(), TripPoint.save()])
        .then(([noteObj, TripPoint]) => TripPoint)
    })
}

mongoose.model('trippoint', TripPointSchema)

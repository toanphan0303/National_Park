const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const ParkSchema = new Schema({
  title: { type: String},
  loc: {
    type:[Number],
    index:'2d'
  },
  activitylocations: [{
    type: Schema.Types.ObjectId,
    ref: 'activitylocation'
  }]
})
ParkSchema.plugin(timestamps);
ParkSchema.statics.addActivityLocation = function(id,title, description, name, url, loc){
  const Activitylocation = mongoose.model('activitylocation')
  return this.findById(id)
    .then(park => {
      const activitylocation = new Activitylocation({park, title, description, name, url, loc})
      park.activitylocations.push(activitylocation)
      return Promise.all([activitylocation.save(), park.save()])
        .then(([activitylocation, park]) => park)
    });
}

ParkSchema.statics.findActivityLocations = function(id) {
  return this.findById(id)
    .populate('activitylocations')
    .then(park => park.activitylocations)
}

mongoose.model('park', ParkSchema)

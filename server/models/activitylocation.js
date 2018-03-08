const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivityLocationSchema = new Schema({
  title: {type: String},
  url: { type: String},
  name: {type: String},
  description: {type: String},
  loc: {
    type: [Number],
    index: '2d'
  },
  park: {
    type: Schema.Types.ObjectId,
    ref: 'park'
  }
})

mongoose.model('activitylocation', ActivityLocationSchema)

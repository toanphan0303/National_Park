const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

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
});
ActivityLocationSchema.plugin(timestamps);

mongoose.model('activitylocation', ActivityLocationSchema)

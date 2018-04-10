const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const ratedSchema = new Schema({
  rated: {type: Number, min: 1, max: 5},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'trip'
  },
})
ratedSchema.plugin(timestamps);

mongoose.model('rated', ratedSchema)

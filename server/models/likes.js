const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  trip: {
    type: Schema.Types.ObjectId,
    ref: 'trip'
  },
})
noteSchema.plugin(timestamps);
mongoose.model('like', noteSchema)

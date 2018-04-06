const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const videoSchema = new Schema({
  title: { type: String},
  url: {type: String}
})
videoSchema.plugin(timestamps);
mongoose.model('video', videoSchema)

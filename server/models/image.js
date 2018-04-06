const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const imageSchema = new Schema({
  title: { type: String},
  url: {type: String}
})
imageSchema.plugin(timestamps);
mongoose.model('image', imageSchema)

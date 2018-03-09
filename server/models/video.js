const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
  title: { type: String},
  url: {type: String}
})

mongoose.model('video', videoSchema)

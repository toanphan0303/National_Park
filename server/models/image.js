const mongoose = require('mongoose');
const {Schema} = mongoose;

const imageSchema = new Schema({
  title: { type: String},
  url: {type: String}
})

mongoose.model('image', imageSchema)

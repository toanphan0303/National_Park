const mongoose = require('mongoose');
const {Schema} = mongoose;

const noteSchema = new Schema({
  title: { type: String},
  content: {type: String}
})

mongoose.model('note', noteSchema)

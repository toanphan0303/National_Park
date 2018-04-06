const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const noteSchema = new Schema({
  title: { type: String},
  content: {type: String}
})
noteSchema.plugin(timestamps);
mongoose.model('note', noteSchema)

const mongoose = require('mongoose');
const {Schema} = mongoose;

const noteSchema = new Schema({
  content: { type: String},
  important: {type: String}
})

module.exports = noteSchema

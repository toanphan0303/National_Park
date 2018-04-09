const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const commentSchema = new mongoose.Schema({
  content: String,
  user:{
      type: Schema.Types.ObjectId,
      ref: 'user'
  },
  trip:{
    type: Schema.Types.ObjectId,
    ref: 'trip'
  }
});
commentSchema.plugin(timestamps);


module.exports = mongoose.model('comment', commentSchema)

const mongoose = require('mongoose');
const {Schema} = mongoose;
const timestamps = require('mongoose-timestamp');
const likeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'comment'
  },
})
likeSchema.plugin(timestamps);
mongoose.model('like', likeSchema)

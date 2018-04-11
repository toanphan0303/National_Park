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
  },
  likes:[{
    type: Schema.Types.ObjectId,
    ref: 'like'
  }]
});
commentSchema.plugin(timestamps);

commentSchema.statics.addLikeToComment = function(userId, commentId){
  const Like = mongoose.model('like')
  const likeObj = new Like({user: userId, comment: commentId})
  return this.findById(commentId)
    .then( comment =>{
      comment.likes.push(likeObj)
      return Promise.all([likeObj.save(), comment.save()])
        .then(([likeObj, comment]) => comment)
    })
}
commentSchema.statics.unlikeToComment = function(commentId, likeId){
  return this.findById(commentId, (err, comment) =>{
    comment.likes.remove({_id:likeId})
    comment.save((err) => {
      if(err){
        console.error('ERROR')
      }
    })
    return comment.populate()
  })
}
commentSchema.statics.findLikes = function(id){
  return this.findById(id)
    .populate('likes')
    .then(comment => comment.likes)
}
module.exports = mongoose.model('comment', commentSchema)

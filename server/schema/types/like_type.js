const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID} = graphql;
const User = mongoose.model('user');
const Comment = mongoose.model('comment')
const UserType = require('./user_type')
const CommentType = require('./comment_type')

const LikeType = new GraphQLObjectType({
  name: 'LikeType',
  fields: () => {
    const UserType = require('./user_type')
    const CommentType = require('./comment_type')
    return{
      id: {type: GraphQLID},
      user : {
        type: UserType,
        resolve(parentValue){
          return User.findById(parentValue.user)
        }
      },
      comment: {
        type: CommentType,
        resolve(parentValue){
          return Comment.findById(parentValue.comment)
        }
      }
    }
  }
})

module.exports = LikeType;

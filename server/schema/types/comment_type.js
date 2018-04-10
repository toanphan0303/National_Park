const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID,GraphQLList} = graphql;
const User = mongoose.model('user');
const Comment = mongoose.model('comment')
const UserType = require('./user_type')
const LikeType = require('./like_type')

const CommentType = new GraphQLObjectType({
  name: 'CommentType',
  fields: () => ({
    id: {type: GraphQLID},
    content: {type: GraphQLString},
    user : {
      type: UserType,
      resolve(parentValue){
        return User.findById(parentValue.user)
      }
    },
    likes: {
      type: new GraphQLList(LikeType),
      resolve(parentValue){
        return Comment.findLikes(parentValue.id)
      }
    }
  })
})

module.exports = CommentType;

const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID} = graphql;
const User = mongoose.model('user');
const UserType = require('./user_type')
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
  })
})

module.exports = CommentType;

const mongoose = require('mongoose');
const graphql = require('graphql');
const User = mongoose.model('user')
const Comment = mongoose.model('comment')
const Rated = mongoose.model('rated')
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => {
    const TripType = require('./trip_type');
    const CommentType = require('./comment_type');
    const RatedType = require('./rated_type')
    return {
      id: {type: GraphQLID},
      email: {type: GraphQLString},
      googleId:{type: GraphQLString},
      facebookId:{type: GraphQLString},
      avatar:{type: GraphQLString},
      firstName:{type: GraphQLString},
      lastName:{type: GraphQLString},
      trips: {
        type: new GraphQLList(TripType),
        resolve(parentValue){
          return User.findTrips(parentValue.id)
        }
      },
      comments:{
        type: new GraphQLList(CommentType),
        resolve(parentValue){
          return User.findComments(parentValue.id)
        }
      },
      rates:{
        type:new GraphQLList(RatedType),
        resolve(parentValue){
          return User.findRates(parentValue.id)
        }
      },
      trips: {
        type: new GraphQLList(TripType),
        resolve(parentValue){
          return User.findTrips(parentValue.id)
        }
      },
      follows:{
        type: new GraphQLList(TripType),
        resolve(parentValue){
          return User.findFollowTrips(parentValue.id)
        }
      }
    }
  }
});

module.exports = UserType;

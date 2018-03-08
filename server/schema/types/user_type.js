const mongoose = require('mongoose');
const graphql = require('graphql');
const User = mongoose.model('user')
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
    return {
      id: {type: GraphQLID},
      email: {type: GraphQLString},
      trips: {
        type: new GraphQLList(TripType),
        resolve(parentValue){
          return User.findTrips(parentValue.id)
        }
      }
    }
  }
});

module.exports = UserType;

const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLFloat} = graphql;
const TripPointType = require ('./trippoint_type');
const UserType = require('./user_type')
const ParkType = require('./park_type')
const Trip = mongoose.model('trip');
const User = mongoose.model('user')
const Park = mongoose.model('park')
const TripType = new GraphQLObjectType({
  name: 'TripType',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    tripImage: {type: GraphQLString},
    tripPoints: {
      type: new GraphQLList(TripPointType),
      resolve(parentValue){
        return Trip.findTripPoints(parentValue.id)
      }
    },
    user : {
      type: UserType,
      resolve(parentValue){
        return User.findById(parentValue.user)
      }
    },
    park : {
      type: ParkType,
      resolve(parentValue){
        return Park.findById(parentValue.park)
      }
    }
  })
})

module.exports = TripType;

const graphql = require('graphql');
const mongoose = require('mongoose');
const ParkType = require('./park_type');
const TripType = require('./trip_type')
const ActivityLocationType = require('./activitylocation_type')

const Park = mongoose.model('park');
const Trip = mongoose.model('trip');
const User = mongoose.model('user');
const Activitylocation = mongoose.model('activitylocation');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = graphql;

const UserType = require('./user_type')
const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    user: {
      type: UserType,
      resolve(parentValue, args, req){
        return req.user;
      }
    },
    parks: {
      type: new GraphQLList(ParkType),
      resolve(){
        return Park.find({})
      }
    },
    park: {
      type: ParkType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}){
        return Park.findById(id)
      }
    },
    activitylocation: {
      type: ActivityLocationType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}){
        return Activitylocation.findById(id);
      }
    },
    trip: {
      type: TripType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id}){
        return Trip.findById(id)
      }
    },
    trips:{
      type: new GraphQLList(TripType),
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id}){
        return User.findTrips(id)
      }
    }
  })
})

module.exports = RootQueryType;

const graphql = require('graphql');
const mongoose = require('mongoose');
const ParkType = require('./park_type');
const TripType = require('./trip_type')
const TripPointType = require('./trippoint_type')
const ActivityLocationType = require('./activitylocation_type')

const Park = mongoose.model('park');
const Trip = mongoose.model('trip');
const User = mongoose.model('user');
const TripPoint = mongoose.model('trippoint')
const Activitylocation = mongoose.model('activitylocation');
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString
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
    parkName:{
      type: ParkType,
      args: {title: {type: new GraphQLNonNull(GraphQLString)}},
      resolve(parentValue, {title}){
        return Park.findOne({"title": title})
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
    },
    tripPoint: {
      type: TripPointType,
      args:{
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id}){
        return TripPoint.findById(id)
      }
    }
  })
})

module.exports = RootQueryType;

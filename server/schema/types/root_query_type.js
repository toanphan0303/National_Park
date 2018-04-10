const graphql = require('graphql');
const mongoose = require('mongoose');
const _ = require('lodash')
const ParkType = require('./park_type');
const TripType = require('./trip_type')
const TripPointType = require('./trippoint_type')
const RatedType = require('./rated_type')
const ActivityLocationType = require('./activitylocation_type')
const Rated = mongoose.model('rated')
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
    userFollowTrips:{
      type: TripType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parentValue, {id}){
        return User.findFollowTrips(id)
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
    popularTrips:{
      type: new GraphQLList(TripType),
      async resolve(){
        return Trip.find({"public": true})
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
    },
    ratedYet:{
      type: RatedType,
      args:{
        userId: {type: new GraphQLNonNull(GraphQLID)},
        tripId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {userId, tripId}){
        return Rated.find({user:{ $eq: userId}, trip:{$eq:tripId}})
          .then(rate =>{
            if(!_.isEmpty(rate)){
              return Rated.findById(rate[0]._id)
            }
            return rate
          })
      }
    },
  })
})

module.exports = RootQueryType;

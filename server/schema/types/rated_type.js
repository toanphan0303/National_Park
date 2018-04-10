const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLID,GraphQLInt} = graphql;
const User = mongoose.model('user');
const Trip = mongoose.model('trip');
const RatedType = new GraphQLObjectType({
  name: 'RatedType',
  fields: () => {
    const UserType = require('./user_type');
    const TripType = require('./trip_type');
    return{
      id: {type: GraphQLID},
      rated: {type: GraphQLInt},
      user : {
        type: UserType,
        resolve(parentValue){
          return User.findById(parentValue.user)
        }
      },
      trip:{
        type: TripType,
        resolve(parentValue){
          return Trip.findById(parentValue.trip)
        }
      }
    }
  }
})

module.exports = RatedType;

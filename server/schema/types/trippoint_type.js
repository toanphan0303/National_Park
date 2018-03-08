const mongoose = require('mongoose');
const graphql = require('graphql');
const activitylocationType = require ('./activitylocation_type');
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat,GraphQLList} = graphql;

const TripPoint = mongoose.model('trippoint')

const TripPointType = new GraphQLObjectType({
  name: 'TripPointType',
  fields: () => ({
    id: {type: GraphQLID},
    image: {type: new GraphQLList(GraphQLString)},
    video: {type: new GraphQLList(GraphQLString)},
    note: {type: new GraphQLList(GraphQLString)},
    activitylocation:{
      type: activitylocationType,
      resolve(parentValue){
        return TripPoint.findActivityLocation(parentValue.id)
      }
    }
  })
})

module.exports = TripPointType;

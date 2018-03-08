const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLFloat} = graphql;
const activitylocationType = require ('./activitylocation_type');

const Park = mongoose.model('park');

const ParkType = new GraphQLObjectType({
  name: 'ParkType',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    loc : {type: new GraphQLList(GraphQLFloat)},
    activitylocations: {
      type: new GraphQLList(activitylocationType),
      resolve(parentValue){
        return Park.findActivityLocations(parentValue.id)
      }
    }
  })
})

module.exports = ParkType;

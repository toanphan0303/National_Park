const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat,GraphQLList} = graphql;

const Activitylocation = mongoose.model('activitylocation');

const ActivityLocationType = new GraphQLObjectType({
  name: 'ActivityLocationType',
  fields: () => ({
    id: {type: GraphQLString},
    title: { type: GraphQLString },
    description: {type: GraphQLString},
    name: {type:GraphQLString},
    url: {type: GraphQLString},
    loc : {type: new GraphQLList(GraphQLFloat)},
    park: {
      type: require('./park_type'),
      resolve(parentValue){
        return Activitylocation.findById(parentValue).populate('park')
          .then(activitylocation => {
            return activitylocation.park
          })
      }
    }
  })
})

module.exports = ActivityLocationType;

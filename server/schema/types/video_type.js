const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString} = graphql;

const VideoType = new GraphQLObjectType({
  name: 'VideoType',
  fields: () => ({
    id: {type: GraphQLString},
    title: { type: GraphQLString },
    url:{ type: GraphQLString },
  })
})

module.exports = VideoType;

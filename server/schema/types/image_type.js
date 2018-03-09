const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString} = graphql;

const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  fields: () => ({
    id: {type: GraphQLString},
    title: { type: GraphQLString },
    url:{ type: GraphQLString },
  })
})

module.exports = ImageType;

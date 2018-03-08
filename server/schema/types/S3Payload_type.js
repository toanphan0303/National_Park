const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList,GraphQLFloat,GraphQLNonNull} = graphql;


const S3PayloadType = new GraphQLObjectType({
  name: 'S3PayloadType',
  fields: () => ({
    signedRequest: { type: new GraphQLNonNull(GraphQLString)},
    url: { type: new GraphQLNonNull(GraphQLString)}
  })
})

module.exports = S3PayloadType;

const mongoose = require('mongoose');
const graphql = require('graphql');
const {GraphQLObjectType, GraphQLString} = graphql;

const NoteType = new GraphQLObjectType({
  name: 'NoteType',
  fields: () => ({
    id: {type: GraphQLString},
    title: { type: GraphQLString },
    content:{ type: GraphQLString },
  })
})

module.exports = NoteType;

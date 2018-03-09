const mongoose = require('mongoose');
const graphql = require('graphql');
const activitylocationType = require ('./activitylocation_type');
const ImageType = require('./image_type')
const VideoType = require('./video_type')
const NoteType = require('./note_type')
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat,GraphQLList} = graphql;

const TripPoint = mongoose.model('trippoint')

const TripPointType = new GraphQLObjectType({
  name: 'TripPointType',
  fields: () => ({
    id: {type: GraphQLID},
    images: {
      type: new GraphQLList(ImageType),
      resolve(parentValue){
        return TripPoint.findImages(parentValue.id)
      }
    },
    videos: {
      type: new GraphQLList(VideoType),
      resolve(parentValue){
        return TripPoint.findVideos(parentValue.id)
      }
    },
    note: {
      type: NoteType,
      resolve(parentValue){
        return TripPoint.findNote(parentValue.id)
      }
    },
    activitylocation:{
      type: activitylocationType,
      resolve(parentValue){
        return TripPoint.findActivityLocation(parentValue.id)
      }
    }
  })
})

module.exports = TripPointType;

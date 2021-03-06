const graphql = require('graphql');
const mongoose = require('mongoose');
const aws =require('aws-sdk');
const Park = mongoose.model('park');
const TripPoint = mongoose.model('trippoint')
const Trip = mongoose.model('trip')
const User = mongoose.model('user')
const Rated = mongoose.model('rated')
const Comment = mongoose.model('comment')
const Keys = require('../../config/keys')
var awsConfig = require('aws-config');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt
} = graphql;
const ParkType = require('./types/park_type')
const TripType = require('./types/trip_type')
const RatedType = require('./types/rated_type')
const TripPointType = require('./types/trippoint_type')
const CommentType = require('./types/comment_type')
const UserType = require('./types/user_type');
const S3PayloadType = require('./types/S3Payload_type')
const AuthService = require('../services/auth');
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup: {
      type: UserType,
      args : {
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString}
      },
      resolve(parentValue, {email, password, firstName, lastName}, req){
        return AuthService.signup({email, password,firstName,lastName, req})
      }
    },
    logout: {
      type: UserType,
      resolve(parentValue, args, req){
        const {user} = req
        req.logout();
        return user
      }
    },
    login: {
      type: UserType,
      args: {
        email: {type: GraphQLString},
        password: {type: GraphQLString}
      },
      resolve(parentValue, {email, password}, req){
        return AuthService.login({email, password, req})
      }
    },
    ratedTrip:{
      type: UserType,
      args:{
        userId:{ type: new GraphQLNonNull(GraphQLID)},
        tripId:{ type: new GraphQLNonNull(GraphQLID)},
        value:{ type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parentValue, {userId, tripId, value}){
        return User.ratedTrip(userId, tripId, value)
      }
    },
    addPark: {
      type: ParkType,
      args: {
        title: {type: GraphQLString},
        loc : {type: new GraphQLList(GraphQLFloat)}
      },
      resolve(parentValue, {title, loc}){
        return ( new Park({title, loc})).save()
      }
    },
    addActivityLocationToPark: {
      type: ParkType,
      args: {
        parkId: { type: new GraphQLNonNull(GraphQLID)},
        title: { type: new GraphQLNonNull(GraphQLString)},
        description: {type: GraphQLString},
        name: {type:GraphQLString},
        url: {type: GraphQLString},
        loc : {type: new GraphQLList(GraphQLFloat)}
      },
      resolve(parentValue, {parkId,title,description,name,url, loc}){
        return Park.addActivityLocation(parkId,title, description, name, url, loc)
      }
    },
    addTrip:{
      type: TripType,
      args: {
        user: {type: new GraphQLNonNull(GraphQLID)},
        tripImage: {type: new GraphQLNonNull(GraphQLString)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        park: {type: new GraphQLNonNull(GraphQLID)},
        public: {type: GraphQLBoolean }
      },
      resolve(parentValue, {user, title, tripImage, park}){
        return Trip.addTrip(user, title, tripImage, park)
      }
    },
    addFollowTrip:{
      type: TripType,
      args:{
        id: { type: new GraphQLNonNull(GraphQLID)},
        tripId: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id, tripId}){
        return User.addFollowTrip(id,tripId)
      }
    },
    deleteTrip:{
      type: UserType,
      args:{
        id: { type: new GraphQLNonNull(GraphQLID)},
        tripId: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id, tripId}){
        return User.deleteTrip(id,tripId)
      }
    },
    deleteFollowTrip:{
      type: UserType,
      args:{
        id: { type: new GraphQLNonNull(GraphQLID)},
        tripId: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {id, tripId}){
        return User.deleteFollowTrip(id,tripId)
      }
    },
    togglePublicSetting:{
      type: TripType,
      args: {
        tripId: { type: new GraphQLNonNull(GraphQLID)},
        value:  { type: new GraphQLNonNull(GraphQLBoolean)}
      },
      resolve(parentValue, {tripId, value}){
        return Trip.togglePublicSetting(tripId,value)
      }
    },
    addCommentToTrip: {
      type: TripType,
      args: {
        tripId: { type: new GraphQLNonNull(GraphQLID)},
        userId: { type: new GraphQLNonNull(GraphQLID)},
        content: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, {tripId, userId, content}){
        return Trip.addCommentToTrip(tripId, userId, content)
      }
    },
    removeCommentFromTrip:{
      type: TripType,
      args: {
        tripId: { type: new GraphQLNonNull(GraphQLID)},
        commentId: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {tripId, commentId}){
        return Trip.removeCommentFromTrip(tripId, commentId)
      }
    },
    addTripPointToTrip: {
      type: TripType,
      args: {
        tripId: {type: new GraphQLNonNull(GraphQLID)},
        tripPointId: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parentValue, {tripId, tripPointId}){
        return Trip.addTripPoint(tripId, tripPointId)
      }
    },
    addTripPoint:{
      type: TripPointType,
      args:{
        images:{ type: GraphQLString},
        videos: { type:  GraphQLString},
        note: { type: GraphQLString},
      },
      resolve(parentValue, args){
        return ( new TripPoint()).save()
      }
    },
    addActivityLocationToTripPoint: {
      type: TripPointType,
      args: {
        tripPointId: {type: new GraphQLNonNull(GraphQLID)},
        activitylocationId:  {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parentValue, { tripPointId,activitylocationId}){
        return TripPoint.addLocation(tripPointId, activitylocationId)
      }
    },
    deleteTripPoint: {
      type: TripPointType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return TripPoint.remove({ _id: id });
      }
    },
    omitPointFromTrip:{
      type: TripType,
      args: {
        tripId: { type: new GraphQLNonNull(GraphQLID) },
        pointId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, {tripId,pointId}){
        return Trip.obmitPointFromTrip(tripId,pointId)
      }
    },
    orderPointsInTrip: {
      type: TripType,
      args: {
        tripId: { type: new GraphQLNonNull(GraphQLID)},
        pointOrder: {type:new GraphQLList(GraphQLString)}
      },
      resolve(parentValue, {tripId,pointOrder}){
        return Trip.orderPointsInTrip(tripId, pointOrder)
      }
    },
    signS3: {
      type: S3PayloadType,
      args: {
        filename:{ type: new GraphQLNonNull(GraphQLString)},
        filetype:{ type: new GraphQLNonNull(GraphQLString)}
      },
        async resolve(parentValue, {filename, filetype}){
          let s3 = new aws.S3(awsConfig({
            region: 'us-east-1',
            sslEnabled: true,
            accessKeyId: Keys.awsAccessKeyId,
            secretAccessKey: Keys.awsSecretAccessKey
          }))
          const s3Params={
            Bucket: Keys.S3Bucket,
            Key: filename,
            Expires: 60,
            ContentType: filetype,
            ACL:'public-read'
          };
            const url =`https://${Keys.S3Bucket}.s3.amazonaws.com/${filename}`;
            const signedRequest = s3.getSignedUrl('putObject', s3Params);
            return {
              signedRequest,
              url
            }
        }
    },
    addImage: {
      type: TripPointType,
      args: {
        pointId: { type: new GraphQLNonNull(GraphQLID)},
        title: {type: new GraphQLNonNull(GraphQLString)},
        url: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, {pointId, title, url}){
        return TripPoint.addImage(pointId, title, url)
      }
    },
    addNote:{
      type: TripPointType,
      args: {
        pointId:{ type: new GraphQLNonNull(GraphQLID)},
        title: { type: GraphQLString},
        content: {type: GraphQLString}
      },
      resolve(parentValue, {pointId,title, content}){
        return TripPoint.addNote(pointId,title, content)
      }
    },
    deleteImage: {
      type:TripPointType,
      args:{
        pointId: { type: new GraphQLNonNull(GraphQLID)},
        imgId: { type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parentValue, {pointId, imgId}){
        return TripPoint.deleteImage(pointId, imgId)
      }
    },
    addLikeToComment:{
      type:CommentType,
      args:{
        userId: { type: new GraphQLNonNull(GraphQLID)},
        commentId: { type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parentValue, {userId, commentId}){
        return Comment.addLikeToComment(userId, commentId)
      }
    },
    unlikeToComment:{
      type:CommentType,
      args:{
        commentId: { type: new GraphQLNonNull(GraphQLID)},
        likeId: { type: new GraphQLNonNull(GraphQLID)},
      },
      resolve(parentValue, {commentId, likeId}){
        return Comment.unlikeToComment(commentId,likeId)
      }
    },
    editCommentContent:{
      type:CommentType,
      args:{
        commentId: { type: new GraphQLNonNull(GraphQLID)},
        content: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parentValue, {commentId, content}){
        return Comment.editCommentContent(commentId,content)
      }
    }
  }
})
module.exports = mutation;

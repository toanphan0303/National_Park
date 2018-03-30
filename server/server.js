const express = require('express');
const expressGraphQL = require('express-graphql');
const apolloUploadExpress = require('apollo-upload-server').apolloUploadExpress
const models = require('./models')
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser')
const passport = require('passport');
require('./services/auth')
require('./services/googleAuth')
require('./services/fbAuth')
const MongoStore = require('connect-mongo')(session);
const schema = require('./schema/schema')
const keys = require('../config/keys')

const app = express();
const options ={
  server: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}},
  replset: {socketOptions: {keepAlive: 1, connectTimeoutMS: 30000}}
}
const MONGO_URI = keys.mongoURI
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, options);
mongoose.connection
  .once('open', () => console.log('Connected to mongo instance'))
  .on('error', error => console.log('Error on connectting to mongo lab', error))

app.use(session({
  resave: true,
  saveUnintialized: true,
  secret: keys.cookieSecret,
  store: new MongoStore({
    url: MONGO_URI,
    autoReconnect: true
  })
}));

app.use(passport.initialize())
app.use(passport.session())
require('./routes/googleAuthRoutes')(app)
require('./routes/fbAuthRoutes')(app)
app.use('/graphql',bodyParser.json(), expressGraphQL({
  schema,
  graphiql: true
}));
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;

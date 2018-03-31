const webpack = require('webpack');
const path = require('path');
const { getIfUtils, removeEmpty } = require('webpack-config-utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglify-js-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const { ifDevelopment, ifProduction } = getIfUtils(nodeEnv);
const VENDOR_LIBS = [
  'react', 'lodash','react-dom',
];

module.exports = removeEmpty({
  entry: {
    bundle: './client/src/index.js',
    vendor: VENDOR_LIBS
  },
  node:{
    fs: "empty"
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: ifProduction('[name].[chunkhash].js')
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules(?!\/quill-image-drop-module|quill-image-resize-module)/
      },

      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 4000 }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: removeEmpty([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV : JSON.stringify(nodeEnv),
        GOOGLE_MAP_API: JSON.stringify(process.env.GOOGLE_MAP_API),
      },
    }),

    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'client/public/index.html'
    }),
    new webpack.ProvidePlugin({
      'window.Quill': 'quill'
    }),
    ifProduction(new UglifyJsPlugin({
     sourceMap: false,
     compress: true,
   }))
 ])
});

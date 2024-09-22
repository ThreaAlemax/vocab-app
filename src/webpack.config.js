// webpack.config.js
const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = {
  // Entry point of your application
  entry: './src/index.js',

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Module rules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  // Plugins
  plugins: [
    new Dotenv(),
  ],

  // Resolve configuration
  resolve: {
    alias: {
      path: 'path-browserify',
    },
  },
};
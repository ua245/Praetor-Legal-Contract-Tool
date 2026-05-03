const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    taskpane: './src/taskpane/taskpane.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    port: 3000,
    hot: true,
    https: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/taskpane/taskpane.html',
      filename: 'taskpane.html',
      chunks: ['taskpane']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.xml',
          to: 'manifest.xml'
        },
        {
          from: 'assets',
          to: 'assets',
          noErrorOnMissing: true
        },
        {
          from: 'src/taskpane/taskpane.css',
          to: 'taskpane.css'
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};

// Made with Bob

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Split dev and prod configs based on this guide:
// https://webpack.js.org/guides/production/
module.exports = {
  entry: {
    index: './src/window/index.tsx',
    'firebase-messaging-sw': './src/service-worker/firebase-messaging-sw.ts'
  },
  module: {
    rules: [
      // Split ts-loader configs so our Service Worker and Window code are
      // compiled separately, using their respective types.
      // https://github.com/TypeStrong/ts-loader/issues/647
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: [path.join(__dirname, 'src/window')],
        options: {
          instance: 'window'
        }
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: [path.join(__dirname, 'src/service-worker')],
        options: {
          instance: 'service-worker'
        }
      },
      {
        test: /\.png$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/window/assets/index.html',
      // Setting { chunks: ["index"] } prevents the service worker from being
      // appended to the document, which is the default behavior of
      // HtmlWebpackPlugin.
      chunks: ['index']
    })
  ]
};

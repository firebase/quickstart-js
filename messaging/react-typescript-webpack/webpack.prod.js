const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',

  // Removes @license comments from the production build.
  //
  // Firebase packages have a @license comment per source file,
  // which adds up quickly.
  //
  // https://github.com/webpack-contrib/terser-webpack-plugin/tree/master#extractcomments
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: true
      })
    ]
  }
});

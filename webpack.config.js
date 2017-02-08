var webpack = require('webpack')
var compact = require('lodash').compact
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var minify = process.env.MINIFY_BUILD

module.exports = {
  entry: './src/index.js',
  output: {
    filename: `dist/css-spring${minify ? '.min' : ''}.js`,
    library: 'css-spring',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            [ 'es2015', { modules: false }],
          ],
        },
      },
    ],
  },
  plugins: compact([
    new LodashModuleReplacementPlugin(),
    minify ? new webpack.optimize.UglifyJsPlugin() : null,
  ]),
}

const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  externals: [nodeExternals()],
  devtool: 'source-map',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [],
  mode: slsw.lib.webpack.isLocal || slsw.lib.options.stage === '' || slsw.lib.options.stage === 'dev'
    ? 'development'
    : 'production',
  optimization: {
    // do not minimize when deploying to development or running locally
    minimize: slsw.lib.webpack.isLocal || slsw.lib.options.stage === '' || slsw.lib.options.stage === 'dev'
      ? false
      : true
  },
  stats: 'minimal', // errors-only, minimal, none, normal, verbose
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js'
  }
};

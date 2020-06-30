/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');

// eslint-disable-next-line prettier/prettier
const isNonProductionBuild = slsw.lib.webpack.isLocal || slsw.lib.options.stage === '' || slsw.lib.options.stage === 'dev';

module.exports = {
  mode: isNonProductionBuild ? 'development' : 'production',
  optimization: {
    // do not minimize when deploying to development or running locally
    minimize: isNonProductionBuild ? false : true,
  },
  entry: slsw.lib.entries,
  devtool: isNonProductionBuild ? 'cheap-module-eval-source-map' : 'source-map',
  //externals: [{'aws-sdk': 'commonjs aws-sdk'}],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    symlinks: false,
    cacheWithContext: false,
    alias: {
      '@lib': path.resolve(__dirname, './src/lib'),
      '@api': path.resolve(__dirname, './src/api'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
            path.resolve(__dirname, '__tests__'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
    ],
  },
};

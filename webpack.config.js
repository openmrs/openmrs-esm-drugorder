const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      localIdentName: 'esm-drugorder__[name]__[local]___[hash:base64:5]',
    },
  },
};

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'openmrs-esm-drugorder.js',
    libraryTarget: 'system',
    path: path.resolve(__dirname, 'dist'),
    jsonpFunction: 'webpackJsonp_openmrs_esm_drugorder',
  },
  module: {
    rules: [
      {
        parser: {
          system: false,
        },
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', cssLoader],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', cssLoader, { loader: 'sass-loader' }],
      },
    ],
  },
  devtool: 'sourcemap',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    disableHostCheck: true,
  },
  externals: [/^@openmrs\/esm.*/, 'i18next', 'single-spa', 'react', 'react-dom', 'react-i18next', 'react-router-dom'],
  plugins: [new ForkTsCheckerWebpackPlugin(), new CleanWebpackPlugin()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
};

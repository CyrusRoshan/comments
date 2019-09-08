const path = require('path');
const AssetsAppendWebpackPlugin = require('assets-append-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new AssetsAppendWebpackPlugin({
      header:
        `
// ==UserScript==
// @name Blog Comments
// @namespace Violentmonkey Scripts
// @match http://localhost:1313/*
// @grant none
// ==/UserScript==` + '\n'.repeat(3),
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: process.env.NODE_ENV,
  watch: isDevelopment,
  watchOptions: {
    aggregateTimeout: 500,
    ignored: ['node_modules'],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.scss', '.json'],
  },
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    filename: isDevelopment ? 'js/script.js' : 'js/script.[contenthash].js',
    path: isDevelopment
      ? path.resolve(__dirname, 'dist')
      : path.resolve(__dirname, 'public'),
    publicPath: './',
    library: 'FbsEditor',
    libraryTarget: 'var',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js\vue)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          fix: false,
          failOnWarning: true,
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: {} },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [require('autoprefixer')()],
            },
          },
          { loader: 'sass-loader', options: {} },
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'img',
              publicPath: '/img',
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]',
              outputPath: 'fonts',
              publicPath: '/fonts',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'static', 'index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? 'css/style.css' : 'css/style.[contenthash].css',
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: 'dist',
        index: 'index.html',
      },
      files: ['dist/js/*.js', 'dist/css/*.css', 'dist/*.html'],
    }),
  ],
  optimization: isDevelopment
    ? {}
    : {
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              output: {
                comments: false,
              },
            },
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorPluginOptions: {
              preset: ['default', { discardComments: { removeAll: true } }],
            },
          }),
        ],
      },
};

/* eslint-enable */

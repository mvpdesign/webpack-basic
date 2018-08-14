const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

const internalIp = require('internal-ip');
const autoprefixer = require('autoprefixer');

const globImporter = require('node-sass-glob-importer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

let plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
];

glob.sync('./src/pages/*.?(html|ejs)').forEach(item => {
  plugins.push(
    new HtmlWebpackPlugin({
      filename: `${path.basename(item, path.extname(item))}.html`,
      template: './src/layouts/app.ejs',
      alwaysWriteToDisk: true,
      templateParameters: {
        page: path.basename(item, path.extname(item))
      }
    })
  );
});

plugins.push(new HtmlWebpackHarddiskPlugin());

module.exports = {
  mode: 'development',
  entry: ['./src/assets/scripts/main.js', './src/assets/styles/main.scss'],
  output: {
    filename: 'bundle.js',
    publicPath: './dist/'
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /(\.scss|\.css)$/,
        use: [
          {
            loader: 'style-loader' // creates style nodes from JS strings
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()]
            }
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sourceMap: true,
              importer: globImporter()
            }
          }
        ]
      }
    ]
  },
  serve: {
    host: internalIp.v4.sync()
  },
  plugins: plugins
};

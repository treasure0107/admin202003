'use strict';
const utils = require('./utils');
const config = require('../config');
const isProduction = process.env.NODE_ENV === 'production';
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;

module.exports = {
  loaders: {
    /*ts-loader*/
    ts: [
      {
        loader: 'ts-loader',
        options: {appendTsxSuffixTo: [/\.vue$/], transpileOnly: true}
      },
    ],
    ...utils.cssLoaders({
      sourceMap: sourceMapEnabled,
      extract: isProduction
    }),
  },
  esModule: true,
  /*ts-loader*/
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
};

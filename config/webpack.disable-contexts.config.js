'use strict'

const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.IgnorePlugin(/^\.\.\/contexts/)
  ]
}

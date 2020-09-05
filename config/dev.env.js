'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BRANCH: JSON.stringify(process.env.BRANCH_ENV) || '"prod"'
})

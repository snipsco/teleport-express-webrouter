require('babel-polyfill')
const express = require('express')
const fs = require('fs')
const http = require('http')

const { IS_LOCALHOST } = require('./lib/config')
const { useRender } = require('./lib/render')

const { SITE_NAME, TRACKING_ID } = process.env

// in localhost condition we need to import
// the secret values from a secret script
if (IS_LOCALHOST) {
  const env = require('node-env-file')
  const type = process.env.TYPE || 'development'
  const fileDir = `${__dirname}/../scripts/${type}_secret.sh`
  if (fs.existsSync(fileDir)) {
    env(fileDir)
  }
}

function getSetup() {
  return new Promise((resolve, reject) => {
    const app = express()
    app.set('port', (process.env.PORT || 5000))
    const helmet = require('helmet')
    app.use(helmet({
      // NOTE: site stops working in Chrome with this option turned on
      noSniff: false
    }))
    // it is important to put all the apis uses before this useRender
    useRender(app, {
      getExtraConfig: req => ({ SITE_NAME, TRACKING_ID })
    })
    const server = http.Server(app)
    resolve({ app,
      server
    })
  })
}

module.exports = getSetup

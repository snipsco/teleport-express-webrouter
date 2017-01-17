const express = require('express')
const path = require('path')
const ejs = require('ejs')

const app = express()
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.use(express.static(path.join(__dirname, '')))

const {
 PORT,
 SITE_NAME
} = process.env
app.set('port', (PORT || 5000))

app.get('/', function (req, res) {
  res.render(path.join(__dirname, 'templates/_index'), {
    SITE_NAME
  })
})

module.exports.app = app

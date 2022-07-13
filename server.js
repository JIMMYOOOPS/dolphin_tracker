require('dotenv').config()
const path = require('path')
const cors = require('cors')
const { PORT } = process.env

// Express Initialization
const express = require('express')
const app = express()

const api = require('./server/routes/api')

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', api)

// Error handling
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send('Internal Server Error')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './', 'index.html'))
})

let server = app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`)
})

module.exports = {
  app, 
  server
}
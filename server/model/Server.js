const express = require('express')
const http = require('http')
const cors = require('cors')
const { dbConnect } = require('../database/config')

class Server {
  constructor () {
    this.app = express()
    this.server = http.createServer(this.app)
    this.port = process.env.NODE_DOCKER_PORT || 3000

    this.middlewares()
    this.routes()
    this.database()
  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())
  }

  routes () {
    this.app.use('/api/movie', require('../routes/movie.routes'))
    this.app.use('/api/artist', require('../routes/artist.routes'))
    this.app.use('/api/countries', require('../routes/countries.routes'))
    this.app.use('/api/genres', require('../routes/genres.routes'))
    this.app.use('/api/languages', require('../routes/languages.routes'))

    this.app.use((req, res) => {
      res.type('text/plain')
      res.status(404)
      res.send('404 - Not found')
    })
  }

  async database () {
    await dbConnect()
  }

  getApp () {
    return this.app
  }

  getServer () {
    return this.server
  }

  listen () {
    this.server.listen(this.port, () => {
      console.log(`Express started on port ${this.port}`)
    })
  }
}

module.exports = new Server()

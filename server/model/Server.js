const express = require('express')
const http = require('http')
const cors = require('cors');

class Server {

    constructor() {
        
        this.app = express()
        this.server = http.createServer( this.app )
        this.port = process.env.NODE_DOCKER_PORT || 3000
                
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.app.use( cors() );
    }

    routes() {

        this.app.use('/api/movie', require('../routes/movie.routes'))

        this.app.use( (req, res) => {
            res.type('text/plain')
            res.status(404)
            res.send('404 - Not found')
        })
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Express started on port ${ this.port }`)
        })
    }
}

module.exports = Server;
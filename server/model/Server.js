const express = require('express')
const http = require('http')

class Server {

    constructor() {
        this.app = express()
        this.server = http.createServer( this.app )
        this.port = process.env.NODE_DOCKER_PORT || 3000
        
        this.routes()
    }

    routes() {
        this.app.get('/', (req, res) => {
            res.status(200).type('text/plain').send('<h1>Movie Archive</h1>')
        })

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
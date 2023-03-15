const express = require('express')

const port = process.env.NODE_DOCKER_PORT || 3000

const app = express()
const server = require('http').createServer( app )

app.get('/', (req, res) => {
    res.status(200).type('text/plain').send('<h1>Movie Archive</h1>')
})

app.use( (req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not found')
})

server.listen(port, () => {
    console.log(`Express started on port ${ port }`)
})
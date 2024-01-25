import express, { Express, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { dbConnect } from "../database/config";
import { artistRouter, countryRouter, genreRouter,
         languageRouter, movieRouter, searchRouter } from '../routes';

export default class Server {

  private app: Express;
  private server: http.Server;
  private port: number | string;

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
    this.app.use('/api/search', searchRouter)
    this.app.use('/api/movie', movieRouter)
    this.app.use('/api/artist', artistRouter)
    this.app.use('/api/countries', countryRouter)
    this.app.use('/api/genres', genreRouter)
    this.app.use('/api/languages', languageRouter)

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ msg: 'Not found'})
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

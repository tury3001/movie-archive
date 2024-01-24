export {}

declare global {
  namespace Express {
    export interface Request {
      movie?: IMovie,
      artist?: IArtist
    }
  }
}
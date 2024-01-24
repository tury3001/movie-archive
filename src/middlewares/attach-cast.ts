import mongoose from 'mongoose';
import { Artist, IArtist } from '../database/models/Artist';
import { NextFunction, Request, Response } from 'express';

export const attachCast = async (req: Request, res: Response, next: NextFunction) => {

  if (req.body.cast && req.body.cast.length > 0) {

    if (req.body.cast.some( (id: string) => !mongoose.isValidObjectId(id)))
      return res.status(400).json({ msg: 'Given cast has invalid ids'})
    
    let artists: IArtist[] = [];
    for (let artistId of req.body.cast) {
      const artist: IArtist | null = await Artist.findById(artistId);
      if (artist)
        artists.push(artist);
    }

    if (artists.some( artist => artist === null))
      return res.status(400).json({ msg: 'Given artist doesn\'t exist'})

    req.body.cast = artists
  }

  next()
}
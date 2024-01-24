import { NextFunction, Request, Response } from "express";
import { Artist, IArtist } from "../database/models/Artist";

export const artistFind = async (req: Request, res: Response, next: NextFunction) => {
  const { artistId } = req.params;

  const artist: IArtist | null = await Artist.findById(artistId);

  if (!artist)
    return res.status(400).json({ msg: "Given artist does not exist" });

  req.artist = artist;

  next();
};
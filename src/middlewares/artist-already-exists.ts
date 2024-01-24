import { NextFunction, Request, Response } from "express";
import { Artist } from "../database/models/Artist";

export const artistAlreadyExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const artist = await Artist.findOne({
    name: req.body.name,
    bornDate: req.body.bornDate,
  });

  if (artist)
    return res.status(400).json({ msg: "Given artist already exists" });

  next();
};

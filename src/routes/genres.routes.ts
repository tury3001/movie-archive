import { Router, Request, Response } from "express";
import { Genre, IGenre } from "../database/models/Genre";

export const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  const genres: IGenre[] | null = await Genre.find({});
  res.status(200).json(genres);
});

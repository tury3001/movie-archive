import { Router, Request, Response } from "express";
import { Country } from "../database/models/Country";

export const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const countries = await Country.find({})
  res.json(countries)
})
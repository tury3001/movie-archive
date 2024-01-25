import { Router, Request, Response } from "express";
import { Language } from "../database/models/Language";

export const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  const languages = await Language.find({});
  res.status(200).json(languages);
});
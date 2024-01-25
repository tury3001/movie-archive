import { Router } from "express";
import { search } from "../controllers/movie.controller";

export const router: Router = Router()

router.get('/:q', search)
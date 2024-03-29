import { Router, Response, Request } from "express";
import { check } from "express-validator";
import { add, update, remove, addToMovie, removeFromMovie } from "../controllers/artist.controller";
import { fieldValidation, attachNationality, artistAlreadyExists, artistFind, movieFind } from "../middlewares";
import { Artist } from "../database/models/Artist";

export const router = Router()

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findOne({ _id: req.params.id })
    return res.status(200).json(artist)
  } catch ( error ) {
    return res.status(400).json({ msg: 'Given artist doesn\'t exist' })
  }
})

router.post('/',
  check('name', 'Artist name can\'t be empty')
    .not().isEmpty()
    .isLength({ min: 1, max: 60 })
    .withMessage('Artist name can\'t have more than 60 characters'),
  check('gender')
    .not().isEmpty()
    .withMessage('Artist gender can\'t be empty')
    .isIn(['F', 'M'])
    .withMessage('Artist gender must be either F or M'),
  check('bornDate')
    .isDate()
    .optional({ nullable: true})
    .withMessage('Artist born date must be a valid date'),
  check('bornPlace')
    .isLength({ max: 60 })
    .withMessage('Artist born place length can\'t be greater than 60 characters'),
  check('bio')
    .isLength({ max: 512 })
    .withMessage('Artist bio can\'t be longer than 512 characters'),
  fieldValidation,
  attachNationality,
  artistAlreadyExists
, add)

router.patch('/:id',
  check('id', 'Given id is invalid')
    .isMongoId()
  ,
  check('name', 'Artist name can\'t be empty')
    .optional()
    .not().isEmpty()
    .isLength({ min: 1, max: 60 })
    .withMessage('Artist name can\'t have more than 60 characters'),
  check('gender')
    .optional()
    .isIn(['F', 'M'])
    .withMessage('Artist gender must be either F or M'),
  check('bornDate')
    .optional({ checkFalsy: true })
    .isDate()
    .withMessage('Artist born date must be a valid date'),
  check('bornPlace')
    .optional()
    .isLength({ max: 60 })
    .withMessage('Artist born place length can\'t be greater than 60 characters'),
  check('bio')
    .optional()
    .isLength({ max: 512 })
    .withMessage('Artist bio can\'t be longer than 512 characters'),
  attachNationality,
  fieldValidation
, update)

router.delete('/:id',
  check('id', 'Given id is invalid')
    .isMongoId(),
  fieldValidation
, remove)

router.patch('/add/:artistId/movie/:movieId',
  check('artistId', 'Artist id is invalid').isMongoId(),
  check('movieId', 'Movie id is invalid').isMongoId(),
  fieldValidation,
  artistFind,
  movieFind,
  addToMovie)

router.patch('/remove/:artistId/movie/:movieId',
  check('artistId', 'Artist id is invalid').isMongoId(),
  check('movieId', 'Movie id is invalid').isMongoId(),
  fieldValidation,
  artistFind,
  movieFind,
  removeFromMovie)
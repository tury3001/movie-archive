import { Router } from "express";
import { check } from "express-validator";
import { add, update, remove, fetch } from "../controllers/movie.controller";
import { fieldValidation, validateCountries, validateLanguages, validateGenres, attachDirector, attachCast } from "../middlewares";

export const router: Router = Router();

router.get('/:id',
  check('id', 'Given id is invalid').isMongoId(),
  fieldValidation,
  fetch
)

router.post('/',
  check('title', 'Title can\'t be empty')
    .not().isEmpty()
    .isLength({ max: 80 })
    .withMessage('Title can\'t be longer than 80 characters'),
  check('year', 'Year can\'t be empty')
    .not().isEmpty().bail()
    .isInt({ min: 1895, max: 3000 })
    .withMessage('The year must be a number between 1895 and 3000'),
  check('director')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid id for director'),
  check('synopsis', 'Given synopsis is invalid')
    .optional({ checkFalsy: true })
    .matches(/^[A-Za-z0-9 .,'!-&]+$/)
    .withMessage('Synopsis should contain only alphanumeric and puntuaction characters')
    .isLength({ max: 512 })
    .withMessage('Synopsis can\'t have more than 512 characters'),
  check('comment', 'Given comment is invalid')
    .optional({ checkFalsy: true })
    .matches(/^[A-Za-z0-9 .,'!-&]+$/)    
    .isLength({ max: 512 })
    .withMessage('Comment can\'t have more than 512 characters'),
  check('tags', 'Given tags are invalid')
    .optional({ checkFalsy: true })
    .isArray(),
  check('tags.*', 'There are invalid tags')
    .not().isEmpty()
    .withMessage('A tag can\'t be empty')
    .matches(/^[A-Za-z0-9 .,'!\-&]+$/)
    .isLength({ max: 60 })
    .withMessage('Tags can\'t have more than 60 characters each'),
  fieldValidation,
  validateCountries,
  validateLanguages,
  validateGenres,
  attachDirector,
  attachCast,
  add
)

router.patch('/:id',
  check('id', 'Given id is invalid').isMongoId(),
  check('title', 'Title is invalid')
    .optional()
    .isLength({ max: 80 })
    .withMessage('Title can\'t be longer than 80 characters'),
  check('year', 'The year is invalid')
    .optional()
    .isInt({ min: 1895, max: 3000 })
    .withMessage('The year must be a number between 1895 and 3000'),
  check('synopsis')
    .optional({ checkFalsy: true })
    .isLength({ max: 512 })
    .withMessage('Synopsis can\'t have more than 512 characters')
    .matches(/^[A-Za-z0-9 .,'!-&]+$/)
    .withMessage('Synopsis should contain only alphanumeric and puntuaction characters'),
  check('director')
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage('Invalid id for director'),
  check('countries')
    .optional()
    .isArray()
    .withMessage('Given countries are invalid'),
  check('languages')
    .optional()
    .isArray()
    .withMessage('Given languages are invalid'),
  check('tags', 'Given tags are invalid')
    .optional()
    .isArray(),
  check('tags.*', 'There are invalid tags')
    .not().isEmpty()
    .withMessage('A tag can\'t be empty')
    .matches(/^[A-Za-z0-9 .,'!\-&]+$/)
    .isLength({ max: 60 })
    .withMessage('Tags can\'t have more than 60 characters each'),
  fieldValidation,    
  attachDirector,
  validateCountries,
  validateLanguages,
  validateGenres,
  update
)

router.delete('/:id',
  check('id', 'Given id is invalid').isMongoId(),
  fieldValidation,
  remove
)

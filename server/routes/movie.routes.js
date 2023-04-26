const { Router } = require('express')
const { check } = require('express-validator')
const { add } = require('../controllers/movie.controller')
const { fieldValidation } = require('../middlewares/field-validation')
const { validateCountries } = require('../middlewares/countries-validation')
const { validateLanguages } = require('../middlewares/languages-validation')
const { validateGenres } = require('../middlewares/genres-validation')
const { attachDirector } = require('../middlewares/attach-director')
const { attachCast } = require('../middlewares/attach-cast')

const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ msg: 'ok' })
})

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

module.exports = router

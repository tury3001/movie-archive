const { Router } = require('express')
const { check } = require('express-validator')
const { add } = require('../controllers/artist.controller')
const { fieldValidation } = require('../middlewares/field-validation')

const router = Router()

router.post('/',
  check('name', 'Artist name can\'t be empty')
    .not().isEmpty()
    .isLength({ min: 1, max: 60 }).withMessage('Artist name can\'t have more than 60 characters')
  ,
  check('gender').not().isEmpty().withMessage('Artist gender can\'t be empty')
    .isIn(['F', 'M']).withMessage('Artist gender must be either F or M'),
  fieldValidation,
  add
)

module.exports = router
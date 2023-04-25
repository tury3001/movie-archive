const { Router } = require('express')
const { check } = require('express-validator')
const { add } = require('../controllers/artist.controller')
const { fieldValidation } = require('../middlewares/field-validation')
const Artist = require('../database/models/Artist')

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findOne({ _id: req.params.id })
    return res.status(200).json(artist)
  } catch ( error ) {
    return res.status(400).json({ message: 'Given artist doesn\'t exist' })
  }  
})

router.post('/',
  check('name', 'Artist name can\'t be empty')
    .not().isEmpty()
    .isLength({ min: 1, max: 60 }).withMessage('Artist name can\'t have more than 60 characters')
  ,
  check('gender').not().isEmpty().withMessage('Artist gender can\'t be empty')
    .isIn(['F', 'M']).withMessage('Artist gender must be either F or M'),
  check('bornDate').isDate().optional({ nullable: true}).withMessage('Artist born date must be a valid date'),
  check('bornPlace').isLength({ max: 60 }).withMessage('Artist born place length can\'t be greater than 60 characters'),
  check('nationality').isLength({ max: 60 }).withMessage('Artist nationality length can\'t be longer than 60 characters'),
  check('bio').isLength({ max: 512 }).withMessage('Artist bio can\'t be longer than 512 characters'),
  fieldValidation,
  add
)

module.exports = router
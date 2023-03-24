const { Router } = require('express')
const { check } = require('express-validator')
const { add } = require('../controllers/movie.controller')
const { fieldValidation } = require('../middlewares/field-validation')

const router = Router()

router.get('/', (req, res) => {
    res.status(200).json({ message: 'ok' })
})

router.post('/',
    check('title', 'Title can\'t be empty')
        .not().isEmpty()
        .isLength({ max: 80 }).withMessage('Title can\'t be longer than 80 characters'),
    fieldValidation,
    add
)

module.exports = router;
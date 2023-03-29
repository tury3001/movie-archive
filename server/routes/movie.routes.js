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
    check('year', 'Year can\'t be empty')
        .not().isEmpty().bail()        
        .isInt({ min: 1895, max: 3000 }).withMessage('The year must be a number between 1895 and 3000'),
    check('director')
        .optional({ checkFalsy: true })
        .isLength({ max: 80 }).withMessage('The director\'s name can\'t have more than 80 characters'),
    check('genres.*', 'Given genres are invalid')
        .not().isEmpty().not().isNumeric(),
    check('synopsis', 'Given synopsis is invalid')
        .optional({ checkFalsy: true }).matches(/^[A-Za-z0-9 .,'!-&]+$/)
        .isLength({ max: 512 }).withMessage('Synopsis can\'t have more than 512 characters'),
    check('comment', 'Given comment is invalid')
        .optional({ checkFalsy: true }).matches(/^[A-Za-z0-9 .,'!-&]+$/)
        .isLength({ max: 512 }).withMessage('Comment can\'t have more than 512 characters'),
    fieldValidation,
    add
)

module.exports = router;
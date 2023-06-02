const { Router } = require('express')
const { search } = require('../controllers/movie.controller')

const router = Router()

router.get('/:q', search)

module.exports = router
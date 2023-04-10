const { Router } = require('express')
const { add } = require('../controllers/artist.controller')

const router = Router()

router.post('/', add)

router.get('/', (req, res) => {
  res.status(201)
})

module.exports = router
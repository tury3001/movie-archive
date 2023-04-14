const { Router } = require('express')
const Genre = require('../database/models/Genre')

const router = Router()

router.get('/', async (req, res) => {  
  const genres = await Genre.find({})
  res.status(200).json(genres)
})

module.exports = router
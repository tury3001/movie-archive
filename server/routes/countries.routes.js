const { Router } = require('express')
const router = Router()
const Country =  require('../database/models/Country')

router.get('/', async (req, res) => {
  const countries = await Country.find({})
  res.json(countries)
})

module.exports = router
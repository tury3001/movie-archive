const { Router } = require('express')
const Language = require('../database/models/Language')

const router = Router()

router.get('/', async (req, res) => {

  const languages = await Language.find({})
  res.status(200).json(languages)
})

module.exports = router
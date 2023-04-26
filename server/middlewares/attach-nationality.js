
const Country = require('../database/models/Country')

const attachNationality = async (req, res, next) => {

  if (req.body.nationality) {
    const country = await Country.findOne({ name: req.body.nationality })
    if (country) {
      req.body.nationality = country
    } else {
      return res.status(400).json({ msg: 'Given nationality does not exist'})
    }
  }

  next()
}

module.exports = { attachNationality }
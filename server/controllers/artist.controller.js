const Artist = require('../database/models/Artist')
const Country = require('../database/models/Country')

const add = async (req, res) => {

  const { name, bornDate, bornPlace, gender, bio, nationality } = req.body

  let country;

  if (nationality) {
    country = await Country.findOne({ name: nationality })
    if (!country) {
      return res.status(400).json({ msg: 'Given nationality does not exist'})
    }
  } else {
    country = null
  }

  const data = {
    name,
    bornDate,
    bornPlace,
    gender,
    bio,
    nationality: country
  }

  try {
    const artist = new Artist( data )
    await artist.save()
  } catch (error) {
    console.log(error)
  }

  res.status(201).json({})
}

module.exports = { add }
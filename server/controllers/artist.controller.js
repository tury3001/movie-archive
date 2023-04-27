const Artist = require('../database/models/Artist')

const add = async (req, res) => {

  const { name, bornDate, bornPlace, gender, bio, nationality } = req.body

  const data = {
    name,
    bornDate,
    bornPlace,
    gender,
    bio,
    nationality
  }

  try {
    const artist = new Artist( data )
    await artist.save()
  } catch (error) {
    console.log(error)
  }

  res.status(201).json({ msg: 'Artist created' })
}

const update = async (req, res) => {

  const { name, bornDate, bornPlace, gender, nationality, bio } = req.body

  const artist = await Artist.findById(req.params.id)

  artist.name = name ?? artist.name
  artist.gender = gender ?? artist.gender
  artist.bornDate = bornDate ?? artist.bornDate
  artist.bornPlace = bornPlace ?? artist.bornPlace

  if ('nationality' in req.body) {
    artist.nationality = nationality === '' ? null : nationality
  }

  await artist.save()

  res.status(204).json({ msg: 'Artist updated' })
}

module.exports = { add, update }
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

  const { name, bornDate, bornPlace, gender, bio, nationality } = req.body

  let data = { name }

  await Artist.findByIdAndUpdate(req.params.id, data)
  res.status(204).json({ msg: 'Artist updated' })
}

module.exports = { add, update }
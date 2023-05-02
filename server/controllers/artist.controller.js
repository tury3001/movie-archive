const Artist = require('../database/models/Artist')
const Movie = require('../database/models/Movie')

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

  if (!artist)
    return res.status(400).json({ msg: 'Artist does not exist' })

  artist.name = name ?? artist.name
  artist.gender = gender ?? artist.gender
  artist.bornDate = bornDate ?? artist.bornDate
  artist.bornPlace = bornPlace ?? artist.bornPlace
  artist.bio = bio ?? artist.bio

  if ('nationality' in req.body) {
    artist.nationality = nationality === '' ? null : nationality
  }

  await artist.save()

  res.status(204).json({ msg: 'Artist updated' })
}

const remove = async (req, res) => {

  const { id } = req.params

  const artist = await Artist.findById(id)

  if (!artist)
    return res.status(400).json({ msg: 'Artist does not exist' })

  await Artist.deleteOne({ _id: id })
  await Movie.updateMany({ director: id }, { director: null })
  
  res.status(200).json({ msg: 'Artist deleted' })

}

module.exports = { add, update, remove }
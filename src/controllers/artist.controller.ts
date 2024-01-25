import { Request, Response } from 'express';
import { Artist, IArtist } from "../database/models/Artist";
import { Movie } from "../database/models/Movie";

export const add = async (req: Request, res: Response) => {

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

export const update = async (req: Request, res: Response) => {

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

export const remove = async (req: Request, res: Response) => {

  const { id } = req.params

  const artist = await Artist.findById(id)

  if (!artist)
    return res.status(400).json({ msg: 'Artist does not exist' })

  await Artist.deleteOne({ _id: id })
  await Movie.updateMany({ director: id }, { director: null })

  await Movie.updateMany({}, { $pull: { cast: id } })

  res.status(200).json({ msg: 'Artist deleted' })

}

export const addToMovie = async (req: Request, res: Response) => {  

  const { artist, movie } = req

  const exist = await Movie.find({ cast: { $in: [ artist ] } });

  if (exist.length > 0)
    return res.status(400).json({ msg: 'The artist is already part of the cast' })

  movie.cast.push(artist)
  await movie.save()

  res.status(200).json({ msg: 'The artist has been added to the given movie' })
}

export const removeFromMovie = async (req: Request, res: Response) => {

  const { artist, movie } = req

  const idx = movie.cast.findIndex( (e: IArtist) => e._id?.toString() === artist._id.toString())

  if (idx === -1)
    return res.status(400).json({ msg: 'The artist is not in the movie cast' })

  movie.cast.splice(idx, 1)
  await movie.save()

  res.status(200).json({ msg: 'The artist has been removed from the movie' })
}
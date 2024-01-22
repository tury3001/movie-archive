const mongoose = require('mongoose')

const data = ( director, cast ) => {
  return [
    {
      title: "Jurassic Park",
      year: 1993,
      director,
      cast,
      genres: [ new mongoose.Types.ObjectId('648ae3b7ff839fc9a3b49814'), new mongoose.Types.ObjectId('648ae3b7ff839fc9a3b4981a') ],
      countries: [ new mongoose.Types.ObjectId('648ae3b7ff839fc9a3b49829'), new mongoose.Types.ObjectId('648ae3b7ff839fc9a3b498eb') ],
      languages: [ new mongoose.Types.ObjectId('648ae3b7ff839fc9a3b4993c') ],
      synopsis: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat qui quis est quibusdam architecto harum provident aspernatur odit. Iste id unde asperiores modi ea quam ab nulla aliquid odio! Maxime.",
      comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam cumque quod vel minima fuga eligendi fugit amet, voluptatem id omnis corporis.",
      tags: [ "dinosaurs", "classic", "pg13" ],
    }
  ]
}

module.exports = { movieData: data }
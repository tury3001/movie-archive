const moviesData = [
  {
    title: "Jurassic Park",
    year: 1993,
    director: null,
    cast: [],
    genres: ["adventure", "sci-fi"],
    countries: ["United States"],
    languages: ["English"],
    synopsis:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat qui quis est quibusdam architecto harum provident aspernatur odit. Iste id unde asperiores modi ea quam ab nulla aliquid odio! Maxime.",
    comment:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam cumque quod vel minima fuga eligendi fugit amet, voluptatem id omnis corporis.",
    tags: ["classic", "film-noir"],
  },
  {
    title: "Blade Runner",
    year: 1982,
    director: ['Ridley Scott'],
    cast: [ 'Harrison Ford', 'Sean Young', 'Rutger Hauer'], 
    genres: ["sci-fi"],
    countries: ["United States"],
    languages: ["English"],
    synopsis:
      "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.",
    comment:
      "Best movie ever.",
    tags: ["android", "philip k. dick", "classic", "film-noir"],
  },
  {
    title: "The Godfather",
    year: 1972,
    director: ['Francis Ford Coppola'],
    cast: [ 'Marlon Brando', 'Al Pacino', 'Diane Keaton'], 
    genres: ["drama"],
    countries: ["United States"],
    languages: ["English", "Italian"],
    synopsis:
      "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael.",
    comment:
      "The greatest movie of all time!",
    tags: ["crime", "mafia", "italy", "classic"],
  },
  {
    title: "The Godfather II",
    year: 1974,
    director: ['Francis Ford Coppola'],
    cast: [ 'Robert De Niro', 'Al Pacino', 'Diane Keaton'], 
    genres: ["drama"],
    countries: ["United States"],
    languages: ["English", "Italian"],
    synopsis:
      "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    comment:
      "One of the greatest films ever made.",
    tags: ["crime", "mafia", "italy", "classic"],
  },
  {
    title: "Blade",
    year: 1998,
    director: ['Stephen Norrington'],
    cast: [ 'Wesley Snipes', 'Stephen Dorff', 'Kris Kristofferson'], 
    genres: ["sci-fi", "action"],
    countries: ["United States"],
    languages: ["English"],
    synopsis:
      "A half-vampire, half-mortal man becomes a protector of the mortal race, while slaying evil vampires.",
    comment:
      "First part of a notable trilogy with Wesley Snipes as Blade, a mythical Vampire Hunter",
    tags: ["vampires", "comic"],
  },
];

function getMoviesData() {
  return Object.assign({}, moviesData);
}

module.exports = { getMoviesData }
const movieData = {
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
};

function getMovieData() {
  return Object.assign({}, movieData);
}

module.exports = getMovieData;

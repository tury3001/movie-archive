const artists = [
    {
        name: 'Patrick Stewart',
        gender: 'M',
        bornDate: '1940-07-13',
        bornPlace: 'Mirfield, United Kingdom',
        nationality: 'United Kingdom',
        bio: 'Stewart gained stardom for his leading role as Captain Jean-Luc Picard in Star Trek: The Next Generation (1987–94), its subsequent films, and Star Trek: Picard (2020–23).'
    },
    {
        name: 'Sigourney Weaver',
        gender: 'F',
        bornDate: '1949-10-08',
        bornPlace: 'Manhattan, New York, United States',
        nationality: 'United States',
        bio: 'Sigourney Weaver is an American actress best known for her role as Ellen Ripley in the Alien film series, a role for which she has received worldwide recognition.'
    },
    {
        name: 'Christopher Nolan',
        gender: 'M',
        bornDate: '1970-07-30',
        bornPlace: 'London, United Kingdom',
        nationality: 'United Kingdom',
        bio: 'Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.'
    }
]

const getArtistData = (n) => {
    return Object.assign({}, artists[n]) // return cloned version for immutability
}

const getManyArtists = () => {
    return JSON.parse(JSON.stringify(artists)) // return cloned version for immutability
}

module.exports = { getArtistData, getManyArtists }
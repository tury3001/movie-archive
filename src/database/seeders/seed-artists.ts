import mongoose from "mongoose";

export const artistData = () => {
  return [
    {
      name: 'Patrick Stewart',
      gender: 'M',
      bornDate: '1940-07-13',
      bornPlace: 'Mirfield, United Kingdom',
      nationality: new mongoose.Types.ObjectId('648ae2f316e0fc4e65c89485'),
      bio: 'Stewart gained stardom for his leading role as Captain Jean-Luc Picard in Star Trek: The Next Generation (1987–94), its subsequent films, and Star Trek: Picard (2020–23).'
  },
  {
      name: 'Sigourney Weaver',
      gender: 'F',
      bornDate: '1949-10-08',
      bornPlace: 'Manhattan, New York, United States',
      nationality: new mongoose.Types.ObjectId('648ae2f316e0fc4e65c89486'),
      bio: 'Sigourney Weaver is an American actress best known for her role as Ellen Ripley in the Alien film series, a role for which she has received worldwide recognition.'
  },
  {
      name: 'Christopher Nolan',
      gender: 'M',
      bornDate: '1970-07-30',
      bornPlace: 'London, United Kingdom',
      nationality: new mongoose.Types.ObjectId('648ae2f316e0fc4e65c89485'),
      bio: 'Over the course of 15 years of filmmaking, Nolan has gone from low-budget independent films to working on some of the biggest blockbusters ever made.'
  }
  ]
}
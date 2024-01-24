import { NextFunction } from 'express';
import { Country, ICountry } from '../database/models/Country';

export const attachNationality = async (req: Request, res: Response, next: NextFunction) => {

  if (req.body.nationality) {
    const country: ICountry | null = await Country.findOne({ name: req.body.nationality })
    if (country) {
      req.body.nationality = country
    } else {
      return res.status(400).json({ msg: 'Given nationality does not exist' })
    }
  }

  next()
}
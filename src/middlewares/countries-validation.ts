import { NextFunction, Request, Response } from "express";
import { Country, ICountry } from "../database/models/Country";

export const validateCountries = async (req: Request, res: Response, next: NextFunction) => {

  if (req.body.countries !== undefined) {

    req.body.countries = [ ...new Set( req.body.countries )]

    let allCountriesExist: boolean = true;
    let country: ICountry | null;
    
    let objectSchemaCountries: ICountry[] = []
    for (let countryName of req.body.countries) {
      country = await Country.findOne({ name: countryName })

      if (!country)
        allCountriesExist = false;
      else
        objectSchemaCountries.push(country)
    }

    if (!allCountriesExist)
      return res.status(400).json({ msg: 'Given country doesn\'t exist' })
    
    req.body.countries = objectSchemaCountries
  }

  next()
}
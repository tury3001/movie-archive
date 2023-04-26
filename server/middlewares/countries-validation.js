const Country = require('../database/models/Country')

const validateCountries = async (req, res, next) => {

  req.body.countries = [ ...new Set( req.body.countries )]

  let allCountriesExist = true;
  let country;
  
  let objectSchemaCountries = []
  for (countryName of req.body.countries) {
    country = await Country.findOne({ name: countryName })

    if (!country)
      allCountriesExist = false;
    else
      objectSchemaCountries.push(country)
  }

  if (!allCountriesExist)
    return res.status(400).json({ msg: 'Given country doesn\'t exist' })
  
  req.body.countries = objectSchemaCountries

  next()
}

module.exports = { validateCountries }
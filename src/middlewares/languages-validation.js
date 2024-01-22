const Language = require('../database/models/Language')

const validateLanguages = async (req, res, next) => {

  if (req.body.languages !== undefined) {

    req.body.languages = [ ...new Set( req.body.languages )]

    let allLanguagesExist = true;
    let language;
    
    let objectSchemaLanguages = []
    for (languageName of req.body.languages) {
      language = await Language.findOne({ name: languageName })

      if (!language)
        allLanguagesExist = false;
      else
        objectSchemaLanguages.push(language)
    }

    if (!allLanguagesExist)
      return res.status(400).json({ msg: 'Given language doesn\'t exist' })
    
    req.body.languages = objectSchemaLanguages
  }

  next()
}

module.exports = { validateLanguages }
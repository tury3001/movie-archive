const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.status(200).type('text/plain').send('<h1>Movie Archive</h1>')
})

module.exports = router;
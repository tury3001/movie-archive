
const add = (req, res) => {
    console.log('Movie added');
    res.status(201).json({ message: 'ok'} )
}

module.exports = { add }
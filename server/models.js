const highScores = require('./highScores.js')

const models = {
    getHighScores: (req, res) => {
      return highScores.find({})
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(err))
    },
    postHighScore: (req, res) => {
        const {name, time, level} = req.body;
        return highScores.create({name, time, level})
        .then(data => res.status(200).send(data))
        .catch(err => res.status(400).send(err))
    },
    updateHighScore: (req, res) => {
        const {name, time, level} = req.body;
        // to do

    }
}

module.exports = models;
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
        var {name, time, level, nameToRemove, timeToRemove} = req.body;
        timeToRemove = (parseInt(timeToRemove.split(':')[0])) * 60 + (parseInt(timeToRemove.split(':')[1])) // convert to number in seconds
        const filter = {name: nameToRemove, time: timeToRemove, level};
        const update = {name, time}
        return highScores.findOneAndUpdate(filter, update)
        .then(data => res.status(200).send(data))
        .catch(err => console.log(err))

    }
}

module.exports = models;
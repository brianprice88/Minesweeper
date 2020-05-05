const mongoose = require('mongoose')

const mongoUri = 'mongodb://localhost/minesweeper'

mongoose.connect(mongoUri, {useNewUrlParser: true})

const highScores = new mongoose.Schema({
    name: {type: String},
    time: {type: Number},
    level: {type: String}
})

module.exports = mongoose.model('highScores', highScores)
const queries = require("../database/queries");

const controllers = {
  getHighScores: async function (req, res) {
    try {
      let highScores = await queries.getHighScores();
      res.send({ highScores: highScores.rows });
    } catch (err) {
      res.status(404).send(err);
    }
  },

  postHighScore: async function (req, res) {
    let { name, time, level } = req.body;
    try {
      let addScore = await queries.postHighScore(name, time, level);
      res.send(addScore);
    } catch (err) {
      res.status(404).send(err);
    }
  },

  updateHighScore: async function (req, res) {
    let { name, time, level, nameToRemove, timeToRemove } = req.body;
    timeToRemove =
      parseInt(timeToRemove.split(":")[0]) * 60 +
      parseInt(timeToRemove.split(":")[1]); // convert to number in seconds
    try {
      let updateScore = await queries.updateHighScore(
        name,
        time,
        level,
        nameToRemove,
        timeToRemove
      );
      res.send(updateScore);
    } catch (err) {
      res.status(404).send(err);
    }
  },
};

module.exports = controllers;

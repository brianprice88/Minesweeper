const cors = require("cors");
const bodyParser = require("body-parser");
const models = require("./models.js");
const controllers = require("./controllers");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./client"));

// for using Postgres:
app.get("/highScores", controllers.getHighScores);
app.post("/highScores", controllers.postHighScore);
app.put("/highScores", controllers.updateHighScore);
// for using Mongo, uncomment the below lines and comment out the above lines:
// app.get("/highScores", models.getHighScores);
// app.post("/highScores", models.postHighScore);
// app.put("/highScores", models.updateHighScore);

app.listen(PORT, () => console.log(`listening at port ${PORT}`));

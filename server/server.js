const cors = require('cors')
const bodyParser = require('body-parser')
const models = require('./models.js')

const express = require('express')
const app = express();
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('./client'))

app.get('/highScores', models.getHighScores)
app.post('/highScores', models.postHighScore)
app.put('/highScores', models.updateHighScore)

app.listen(PORT, () => console.log(`listening at port ${PORT}`))
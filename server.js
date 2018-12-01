const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const bodyParser = require('body-parser');
const hash = require('object-hash');
const cors = require('cors');
const helmet = require('helmet');
const Filter = require('bad-words');
const filter = new Filter();

const ScoreSchema = new mongoose.Schema({
  jxID: String,
  scores: Array
});

const Scores = mongoose.model('Scores', ScoreSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.use(helmet());

app.disable('x-powered-by');

app.get("/api/scores", (req, res) => {
  Scores.find((err, data) => {
    if (err) return console.error(err);
    res.json(data);
  });
});

app.post("/api/postscore", (req, res) => {
  Scores.find((err, data) => {
    if (err) console.error(err);
    let currentScores = data[0].scores;
    req.body.name = filter.clean(req.body.name);
    currentScores.push(req.body);
    currentScores.sort((a, b) => b.score - a.score);
    currentScores.pop();
    Scores.findOneAndUpdate({jxID: hash(process.env.SECRET)}, {scores: currentScores}, {new: true}, (err, data) => {
      if (err) console.error(err);
      console.log(data);
      res.send(data);
    });
  });
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

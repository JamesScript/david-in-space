const express = require('express');
const app = express();
const mongodb = require('mongodb');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const bodyParser = require('body-parser');
const hash = require('object-hash');
const cors = require('cors');
const Filter = require('bad-words');
const filter = new Filter();

console.log(filter.clean("bollocks fucking cunt bastard wank shit bellend cumdumpster bitch cocksucker asshole prick"));

const ScoreSchema = new mongoose.Schema({
  jxID: String,
  scores: Array
});

const Scores = mongoose.model('Scores', ScoreSchema);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

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

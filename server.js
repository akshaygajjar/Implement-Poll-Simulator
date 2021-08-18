const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const ejs = require('ejs');

const { candidates, voters, candidateVotes, studentName } = require('./data');
app.set('view engine', 'ejs');

app.locals.baseURL = 'http://localhost:3000';

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// VOTER ROUTES

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/voter', (req, res) => {
  res.render('voter', {
    msgCode: 'PAGE_RENDERED',
  });
});

app.post('/voter/castVote', (req, res) => {
  const { studentID, voteRadio } = req.body;

  const cidx = candidates.findIndex((x) => x.candidateID === voteRadio);
  candidates[cidx].voteCount++;

  res.render('voter', {
    msgCode: 'VOTED',
  });
});

app.get('/voter/castVote', (req, res) => {
  res.render('voter', {
    msgCode: 'INVALID_REQUEST',
  });
});

// ADMIN ROUTES

app.get('/admin', (req, res) => {
  res.render('admin', {
    msgCode: '',
  });
});

app.get('/addCandidatePage', (req, res) => {
  res.render('addCandidatePage', {
    msgCode: 'PAGE_RENDERED',
  });
});

app.post('/addCandidate', (req, res) => {
  candidates.push({
    candidateID: req.body.candidateID,
    candidateName: req.body.candidateName,
    voteCount: 0,
  });

  res.render('addCandidatePage', {
    msgCode: 'CANDIDATE_ADDED',
  });
});

app.get('/pollResults', (req, res) => {
  candidates.sort((a, b) => (a.voteCount > b.voteCount ? -1 : 1));

  res.render('pollResultPage', {
    msgCode: 'POLL_RESULTS',
    winners: candidates,
  });
});

app.get('/votingSummary', (req, res) => {
  candidates.sort((a, b) => (a.voteCount > b.voteCount ? -1 : 1));

  res.render('votingSummaryPage', {
    msgCode: 'POLL_RESULTS',
    winners: candidates,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Example app listening on port 3000 !!!');
});

const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/hackathon', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const mentorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  Subjects: [],
  Times: []
});

mentorSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
mentorSchema.set('toJSON', {
  virtuals: true
});

const Mentor = mongoose.model('Mentor', mentorSchema);

app.get('/api/mentors', async (req, res) => {
  try {
    let mentors = await Mentor.find();
    res.send({mentors: mentors});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/mentors', async (req, res) => {
    const mentor = new Mentor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    Subject: req.body.subjects,
    Times: req.body.times
  });
  try {
    await mentor.save();
    res.send({mentor:mentor});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/mentors/:userName', async (req, res) => {
  try {
    await Mentor.deleteOne({
      userName: req.params.userName
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
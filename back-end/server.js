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

const subjectSchema = new mongoose.Schema({
  name: String
});

subjectSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

subjectSchema.set('toJSON', {
  virtuals: true
});

const Subject = mongoose.model('Subject', subjectSchema);

app.get('/api/subjects', async (req, res) => {
  try {
    let subjects = await Subject.find();
    res.send({subjects: subjects});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/subjects', async (req, res) => {
    const subject = new Subject({
    name: req.body.name
  });
  try {
    await subject.save();
    res.send({subject:subject});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
});

personSchema.virtual('id')
  .get(function() {
    return this._id.toHexString();
  });
  
personSchema.set('toJSON', {
  virtuals: true
});

const Person = mongoose.model('Person', personSchema);

app.get('/api/persons', async (req, res) => {
  try {
    let persons = await Person.find();
    res.send({persons: persons});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/persons', async (req, res) => {
    const person = new Person({
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });
  try {
    await person.save();
    res.send({person:person});
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    await Person.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));

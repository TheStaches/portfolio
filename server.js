const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const profile = require('./profile')
const fs = require('fs');
require('dotenv').config();
const Mailchimp = require('mailchimp-api-v3');
const mailchimp = new Mailchimp(process.env.API_KEY);

const app = express();
const router = express.Router();
const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/profile', profile);
app.use(express.static(__dirname + '/views'));

app.set('views', './views');
app.set('view engine', 'ejs');

//  GET
app.get('/', (req, res) => {
  const data = {
    person: {
      firstName: 'Eric',
      lastName: 'Dodds',
    }
  }
  res.render('home', data);
});

app.get('/contact', (req, res) => {
  res.render('contact');
})

app.get('/thanks', (req, res) => {
  res.render('thanks', { contact: req.body })
})

app.get('/resume', (req, res) => {
  let resume = './views/files/resume.pdf'
  fs.readFile(resume, (err,pdf) => {
    res.contentType("application/pdf");
    res.send(pdf);
  })
})

// POST
app.post("/thanks", (req, res) => {
  mailchimp.post('/lists/7162a6f04d/members', {
    merge_fields: {
      FNAME: (req.body.name).split(" ").slice(0, -1).join(" "),
      LNAME: (req.body.name).split(" ").slice(0-1).join(" "),
    },
    email_address : req.body.email,
    status : 'subscribed'
  })
  .then((response) => {
    res.render('thanks', { 
      contact: {
        name: (req.body.name.split(' ').length !== 1 ) ? (req.body.name).split(" ").slice(0, -1).join(" ") : req.body.name.split(' '),
        email: req.body.email,
        messgae: req.body.message
      }})
  }).catch(err => res.status(400).send(err.message));
});

// GET Catch
app.get('*', (req, res) => {
  res.send('Whoops, page not found 404').status(404);
})


app.listen(PORT, () => {console.log(`listening at http://localhost:${PORT}`);});
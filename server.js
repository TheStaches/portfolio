const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const profile = require('./profile')

const app = express();
const router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/profile', profile);

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
  res.render('index', data);
});

app.get('/contact', (req, res) => {
  res.render('contact');
})

app.get('/thanks', (req, res) => {
  res.render('thanks', { contact: req.body });
})

//  POST
app.post('/', (req, res) => {
  res.send('POST request to homepage')
})

// GET Catch
app.get('*', (req, res) => {
  res.send('Whoops, page not found 404').status(404);
})


router

app.listen(8080, () => {
  console.log('listening at http://localhost:8080');
});
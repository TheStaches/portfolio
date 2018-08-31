const express = require('express');
const router = express.Router();


router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next();
})

router.get('/', (req, res) => {
  res.send('Hello World')
})

router.get('/about', (req, res) => {
  res.send('About me');
})

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'SocialMiner Chat Sample' });
});

module.exports = router;

'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.send('Ok!');
});

module.exports = router;

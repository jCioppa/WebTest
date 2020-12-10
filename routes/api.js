var express = require('express');
var controller = require('../controllers/ValidationController')
var router = express.Router();

router.post('/validate', function(req, res, next) 
{
     controller.Validate(req, res, next);
});

module.exports = router;
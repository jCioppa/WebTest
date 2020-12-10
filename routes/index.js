var express = require('express');
var controller = require('../controllers/IndexController');
var router = express.Router();

router.get('/', function(req, res, next) 
{
   controller.Index(req, res, next);
});

router.get('/start', function(req, res, next) 
{
   controller.Start(req, res, next);
});

router.get('/complete', function(req, res, next)
{ 
   controller.Complete(req, res, next);
});

router.get('/dropdown', function(req, res, next)
{
   res.render('dropdown');
});

module.exports = router;
var express = require('express');
var router = express.Router();
var request = require('request-promise');
var imgHelper = require('../helpers/images');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/data', function(req, res, next) {
	imgHelper.handleImage(req.body.nick, req.body.base64)
	.then(function () {
		console.log('File saved');
		if (!req.body.id) {
			res.status(502).send('Сначала сохраните пользователя в базе!');
			return;
		}
		var path = req.body.nick.replace(/\s+/g, '') + '.jpg';
		console.log('ID exists');
  	request({
  		method: 'PATCH',
  		uri: 'http://localhost:8080/data',
			json: true,
  		body: {
  			table: 'players',
  			items: {
  				imglink: 'http://localhost:3000/img/players/' + path
  			},
  			ids: req.body.id
  		}
  	}).then(function () {
  		res.send('Succses');
  	}, function (err) {
  		res.status(503).send(err);
  	})

	}, 
	function (err) {
		res.status(501).send(err);
	});
	
});

module.exports = router;

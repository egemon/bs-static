var _ = require('lodash');
var express = require('express');
var router = express.Router();
var request = require('request-promise');
var imgHelper = require('../helpers/images');
var connection = require('../helpers/connection');
var mainBEuri = 'http://bakerstreet.herokuapp.com';
// var mainBEuri = 'http://localhost:8080';
var staticBEuri = 'http://bs-static.herokuapp.com:8090';
// var staticBEuri = 'http://localhost:8090';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/data', function(req, res, next) {
	var {
		nick,
		base64,
		id,
		credentials: {
			user,
			password
		}
	} = req.body;
	console.log(nick, id, user, password);

	var mainBase = new connection(`select memberlevel from players where nick = '${user}' and password = '${password}';`,
		{
			DB_NAME: 'dcm7vrqpua1afn',
			DB_HOST: 'ec2-54-221-244-190.compute-1.amazonaws.com:5432',
			DB_USER: 'zgnzyaffdzjhcy',
			DB_PASSWORD: 'zdxG_Iyl3lm4Ardyhsi4YZDNo3'
		});
	mainBase.execQuery().then(function (DBresponse) {
		console.log('DB response', DBresponse.rows);
		if (_.isEmpty(DBresponse.rows)) {
			throw new Error('Нет юзера с этим логином и паролем!');
		} else if (DBresponse.rows[0].memberlevel < 3) {
			throw new Error('Недостаточно прав для этого действия!');
		}

		imgHelper.handleImage(req.body.nick, req.body.base64)
		.then(function () {
		    if (!req.body.id) {
		      res.status(502).send('Сначала сохраните пользователя в базе!');
		      return;
		    }


		    var path = req.body.nick.replace(/\s+/g, '') + '.jpg';
		    request({
		      method: 'PATCH',
		      uri: `${mainBEuri}/data`,
		      json: true,
		      body: {
		        table: 'players',
		        items: {
		          imglink: `${staticBEuri}/img/players/${path}`
		        },
		        ids: req.body.id
		      }
		    }).then(function () {
			   console.log('File saved');
		        res.send('Succses');
		    }, function (err) {
		        res.status(503).send(err);
		    });

		},
		function (err) {
			res.status(501).send(err);
		});
	}).catch(function (err) {
		res.status(504).send(err);
	})

});

module.exports = router;

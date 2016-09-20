var fs = require('fs-promise');
var q = require('q');
var _ = require('lodash');
var pgHelper = require('./pg.helper');
var IMG_PATH = "./public/img/players/";
function handleImage(nick, base64) {
	console.log('[dataBase] handleImage()');

	//hardcode fromat for sinplicity
	var format = '.jpg';
	var filename = nick.replace(/\s+/g, '') + format;
	var savePromise = saveImgFile(base64, filename, format).then(function(){
        return pgHelper.saveFile(base64, IMG_PATH + filename, 'base64');
	});
	return savePromise;
}

function saveImgFile(base64text, fileName, format, path) {
	console.log('[dataBase] saveImgFile()', fileName);
	var base64Data = base64text.replace(/^.*;base64,/, "");
	if (path) {
		console.log(path);
		return fs.writeFile(path, base64Data, 'base64');
	}

	var FORMATS = {
		'.png': true,
		'.jpg': true,
		'.jpeg': true,
		'.bmp': true
	};
	if (format in FORMATS) {
		return fs.writeFile(IMG_PATH + fileName, base64Data, 'base64');
	} else {
		throw new Error('Неподдерживаемый формат изображения!');
	}
}


function restoreFilesFromDB (dataFormat) {
	return pgHelper.getFiles(dataFormat).then(function (data) {
		console.log(_.map(data.rows, 'path'));
		return q.all(_.map(data.rows, function (fileObj) {
			return saveImgFile(fileObj.data, null, null, fileObj.path);
		})).then(function () {
			console.log('All images restored');
		});
	});
}

function migrateFilesToDB () {
	return fs.readdir(IMG_PATH).then(function (imageNames) {
		console.log('fs.readdir(IMG_PATH');
		var chunks = _.chunk(imageNames, 10);
		return migrateChunk(chunks[0]);
	});
}

function migrateChunk (imageNames) {
	return _.map(imageNames, function (imageName) {
		return fs.readFile(IMG_PATH + imageName).then(function (data) {
			console.log('fs.readFile(IMG_PATH ');
			var base64data = new Buffer(data).toString('base64');
			console.log('beforeSaveFile');
			return pgHelper.saveFile(base64data, IMG_PATH + imageName, 'base64');
		});
	}).then(function () {
		console.log('Finished');
	});
}

module.exports = {
	handleImage: handleImage,
	restoreFilesFromDB: restoreFilesFromDB,
	migrateFilesToDB: migrateFilesToDB,
};
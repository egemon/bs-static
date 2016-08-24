var fs = require('fs-promise');
var q = require('q');
var pgHelper = require('./pg.helper');
var IMG_PATH = "./public/img/players/";
function handleImage(nick, base64) {
	console.log('[dataBase] handleImage()');

	//hardcode fromat for sinplicity
	var format = '.jpg';
	var filename = nick.replace(/\s+/g, '') + format;
	var savePromise = saveImg(base64, filename, format).then(function(){
        return pgHelper.saveFile(base64, IMG_PATH + filename, 'base64');
	});
	return savePromise;
}

function saveImg(base64text, fileName, format) {
	console.log('[dataBase] saveImg()', fileName);
	var FORMATS = {
		'.png': true,
		'.jpg': true,
		'.jpeg': true,
		'.bmp': true
	};
	if (format in FORMATS) {
		var base64Data = base64text.replace(/^.*;base64,/, "");
		return fs.writeFile(IMG_PATH + fileName, base64Data, 'base64');
	} else {
		throw new Error('Неподдерживаемый формат изображения!');
	}
}

module.exports = {
	handleImage: handleImage
}
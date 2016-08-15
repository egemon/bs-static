var fs = require('fs-promise');
function handleImage(nick, base64) {
	console.log('[dataBase] handleImage()');

	//hardcode fromat for sinplicity
	var format = '.jpg';
	var filename = nick.replace(/\s+/g, '') + format;
	return saveImg(base64, filename, format);
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
		return fs.writeFile("./public/img/players/"+ fileName, base64Data, 'base64');
	} else {
		throw new Error('Неподдерживаемый формат изображения!');
	}
}

module.exports = {
	handleImage: handleImage
}
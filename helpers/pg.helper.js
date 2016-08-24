var connection = require('./connection');
function saveFile (base64, path, format) {
	console.log('saveFile()', path, format);
	var saveRecord = new connection(`insert into files (path, data, format) values ( '${path}', '${base64}', '${format}' );`,
		{
			DB_NAME: 'da9cn9pm8e1er8',
			DB_HOST: 'ec2-54-228-192-254.eu-west-1.compute.amazonaws.com:5432',
			DB_USER: 'mkobsbvenoupie',
			DB_PASSWORD: '1Oq_VVrbqMPxe5DprhpOyl01TH'
		});
	return saveRecord.execQuery();
}
module.exports = {
	saveFile: saveFile
};
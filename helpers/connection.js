'use strict';
var pg = require('pg');
pg.defaults.ssl = true;
module.exports = class Connection {
	constructor(sql, options){
		this.sql = sql;

		let dbName = process.env.DB_NAME || options.DB_NAME || 'imap_e2e';
		let dbHost = process.env.DB_HOST || options.DB_HOST || 'localhost';
		let dbUser = process.env.DB_USER || options.DB_USER || 'djul';
		let dbPassword = process.env.DB_PASSWORD || options.DB_PASSWORD || 'dba';

		let conString = `postgres://${dbUser}:${dbPassword}@${dbHost}/${dbName}`;
		// var conString = 'postgres://zgnzyaffdzjhcy:zdxG_Iyl3lm4Ardyhsi4YZDNo3@ec2-54-221-244-190.compute-1.amazonaws.com:5432/dcm7vrqpua1afn';
		this.client = new pg.Client(conString);
	};

	sqlQuery(){
		if (this.sql === '' || this.sql === null) {
			throw new Error('Method should be overridden!');
		}

		return this.sql;
	};

	runStatement(){
		return new Promise((resolve, reject) => {
			console.log('SQL query: ', this.sqlQuery());
			this.client.query(this.sqlQuery(), (err, result) => {
				if(err) {
					console.log('Unable to execute SQL: ', this.sqlQuery());
					reject(`Error: ${err}`);
				}

				resolve(result);

		this.client.end();
	});
	});
	};

	execQuery(){
		return new Promise((resolve, reject) => {
				this.client.connect(err => {
				if(err) {
					reject(`Could not connect to PostgreSQL: ${err}`);
				}
				resolve(this.runStatement());
	});
	});
	};
};


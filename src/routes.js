const PouchDB = require('pouchdb')

let pouchdb_app = new PouchDB('pouchdb_app')
module.exports = (app) => {
	app.use('/', require('./routes/home'))
	app.use('/db', require('express-pouchdb')(PouchDB))
}
const express = require('express')
// const bodyParser = require('body-parser')
const hbs = require('express-hbs')
const logger = require('morgan')
const path = require('path')

const app = express()

app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'hbs')
app.set('port', 8080)

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'src/public')))
app.engine('hbs', hbs.express4({
	defaultLayout: path.join(app.get('views'), 'layouts/home.hbs'),
	partialsDir  : path.join(app.get('views'), 'partials'),
	layoutsDir   : path.join(app.get('views'), 'layouts')
}))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

require('./src/routes')(app)

app.listen(app.get('port'), () => {
	console.log('Express started')
})

module.exports = app
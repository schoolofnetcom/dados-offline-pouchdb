const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
	return res.render('home/index', {
		msg: 'PouchDB Offline First'
	})
})

module.exports = router
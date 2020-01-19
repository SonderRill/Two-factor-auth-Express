const express = require('express');
const router = express.Router()
const passport = require('passport')

//защищённая страничка
router.get('/twofactor', passport.authenticate('jwt', {session: false}), (req, res) => {
	res.send('Hello')
})

module.exports = router

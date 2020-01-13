const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const passport = require('passport');

const User = require('../modules/User');
const config = require('../config/keys');
const router = express.Router();

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	res.send('ewee')
})

//register
router.post('/register', async(req, res) => {
	try {
		const {name, password} = req.body;
		if(name && password) {
			const user = await User.findOne({name})

			if(user) {
				res.status(409).json({
					message: 'Такое имя уже занято'
				})
			}

			else {

				const secret = speakeasy.generateSecret({ 
       			length: 30,
        			name: `Sitename ${name}`
    			});

				const salt = bcrypt.genSaltSync(10)

				const user = new User({
						name,
						password: bcrypt.hashSync(password, salt),
						secret: secret.base32

				})

				await user.save()

				const qrcode = await QRCode.toDataURL(secret.otpauth_url);

				res.status(200).json({
					user,
					qrcode
				})
			}
			
		}
		else {
			res.status(409).json({
					message: 'Не заполнены поля'
			})
		}
	} catch(e) {
		
		console.log(e);
	}

})


//login
router.post('/login', async(req, res) => {
	try {
		const {name, password, token} = req.body;
		if(name && password && token) {

			const user = await User.findOne({name})
			if(user) {

				const passwordResult = bcrypt.compareSync(password, user.password)

				const tokenValidates = speakeasy.totp.verify({
        			secret: user.secret,
        			encoding: 'base32',
        			token, 
        			window: 1
    			});

				if(passwordResult && tokenValidates) {

					const token = jwt.sign({
						name: user.name, 
						userId: user._id
					}, config.jwt, {expiresIn: 3600})

					res.status(200).json({
						token: `Bearer ${token}`
					})
				}

				else {
					res.status(404).json({
						message:'Пароль или токен не верен'
					})
				}
			}
			else {
				res.status(404).json({
					message:'Пользователь не найден'
				})
			}

		}
		else {

			res.status(409).json({
				message:'Поля не заполнены'
			})

		}
	} catch(e) {
		
		console.log(e);
	}
	
})


module.exports = router
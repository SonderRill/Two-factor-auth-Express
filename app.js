const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const config = require('./config/keys.js')

const startMongo = async () => {
	try {
		await mongoose.connect(...config.db)
		console.log('Mongoose has been connected')
	} catch(e) {
		
		console.log(e);
	}
}

startMongo()
app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use('/auth', require('./routes/auth'));
app.use('/routes', require('./routes/twofactor'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server has been started ${PORT}`))

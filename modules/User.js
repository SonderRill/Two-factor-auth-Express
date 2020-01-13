const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name:{
		type:String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	},
	secret:{
		type: String,
		required: true
	}
})

module.exports = mongoose.model('Usersses', UserSchema)
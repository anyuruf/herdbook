let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let Note = new Schema({
	date: {
		type: Date
	},
	text: {
		type: String
	}
})


let Event = new Schema({
	type: {
		type: String
	},
	date: {
		type: Date
	},
	text: {
		type: String
	},
	data: {
		type: {}
	}
})


let individualModel = new Schema({
	rrid: {
		type: String
	},
	name: {
		type: String
	},
	breed: {
		type: ObjectId,
		ref: 'Breed'
	},
	sex: {
		type: String
	},
	dob: {
		type: Date
	},
	dame: {
		type: String
	},
	sire: {
		type: String
	},
	location: {
		type: String
	},
	notes: [Note],
	events: [Event]
})


module.exports = mongoose.model('Individual', individualModel)
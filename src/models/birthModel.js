let mongoose = require('mongoose')
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let birthModel = new Schema({
	rrid: {
		type: String
	},
	dame: {
		type: ObjectId,
		ref: 'Individual'
	},
	sire: {
		type: ObjectId,
		ref: 'Individual'
	},
	dob: {
		type: Date
	},
	kids: {
		type: [ObjectId]
	}
})


module.exports = mongoose.model('Birth', birthModel)

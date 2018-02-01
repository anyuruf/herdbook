let mongoose = require('mongoose')
let Schema = mongoose.Schema


let breedModel = new Schema({
	rrid: {
		type: String
	},
	name: {
		type: String
	},
	type: {
		type: String
	},
	description: {
		type: String
	}
})


module.exports = mongoose.model('Breed', breedModel)

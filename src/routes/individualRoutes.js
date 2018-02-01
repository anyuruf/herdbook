
let express = require('express')

let routes = (IndividualModel) => {

	let router = express.Router()
	let controller = require('../controllers/individualController')(IndividualModel)

	router.route('/')
		.post(controller.post)
		.get(controller.getAll)

	router.use('/:id', controller.findById)

	router.route('/:id')
		.get(controller.get)
		.put(controller.put)
		.patch(controller.patch)
		.delete(controller.delete)

	return router
}

module.exports = routes

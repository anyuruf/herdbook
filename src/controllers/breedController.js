
let breedController = (BreedModel) => {

	let findById = (req, res, next) => {
		BreedModel.findById(req.params.id, (err, obj) => {
			if (err) {
				res.status(500).send(err)
			}
			else if (obj) {
				req.breed = obj
				next()
			}
			else {
				res.status(404).send('no BreedModel found')				
			}
		})

	}


	let post = (req, res) => {
		let obj = new BreedModel(req.body)
		if (!req.body.name) {
			res.status(400)
			res.send('Name is required')
		}
		else {
			obj.save()
			res.status(201)
			res.send(obj)
		}
	}


	let getAll = (req, res) => {
		let query = {}

		if (req.query.type) {
			query.type = req.query.type
		}

		BreedModel.find(query, (err, goats) => {
			if (err) {
				console.log(err)
				res.status(500).send(err)
			}
			else {
				let returnObjs = []
				goats.forEach((element, index, array) => {
					let newObj = element.toJSON()
					newObj.links = {}
					newObj.links.self = 'http://' + req.headers.host + '/api/breeds/' + newObj._id
					returnObjs.push(newObj)
				})

				res.json(returnObjs)
			}
		})
	}


	let get = (req, res) => {

		let returnObj = req.breed.toJSON()
		returnObj.links = {}
		let newLink = 'http://' + req.headers.host + '/api/breeds?type=' + returnObj.type
		returnObj.links.filterByBreedType = newLink.replace(' ', '%20')

		res.json(returnObj)
	}


	let put = (req, res) => {
		req.breed.title = req.body.name
		req.breed.author = req.body.type
		req.breed.genre = req.body.description

		req.breed.save((err) => {
			if (err) {
				res.status(500).send(err)
			}
			else {
				res.json(req.breed)
			}
		})
	}


	let patch = (req, res) => {
		if (req.body._id) {
			delete req.body._id
		}
		
		for (let p in req.body) {
			req.breed[p] = req.body[p]
		}

		req.breed.save((err) => {
			if (err) {
				res.status(500).send(err)
			}
			else {
				res.json(req.breed)
			}
		})
	}


	let del = (req, res) => {
		req.breed.remove((err) => {
			if (err) {
				res.status(500).send(err)
			}
			else {
				res.status(204).send('Removed')
			}
		})
	}


	return {
		findById: findById,
		post: post,
		getAll: getAll,
		get: get,
		put: put,
		patch: patch,
		delete: del
	}
}

module.exports = breedController


let individualController = (IndividualModel) => {

	let findById = (req, res, next) => {

		IndividualModel
		  .findOne({ _id: req.params.id })
		  .populate('breed', 'name')
		  .exec(function (err, ind) {
			if (err) {
				res.status(500).send(err)
			}
			else if (ind) {
				req.individual = ind
				next()
			}
			else {
				res.status(404).send('no individual found')				
			}
		  });
	}


	let post = (req, res) => {
		let obj = new IndividualModel(req.body)
		if (!req.body.title) {
			res.status(400)
			res.send('Title is required')
		}
		else {
			obj.save()
			res.status(201)
			res.send(obj)
		}
	}


	let getAll = (req, res) => {
		let query = {}

		if (req.query.breedId) {
			query.breedId = req.query.breedId
		}

		IndividualModel.find(query, (err, inds) => {
			if (err) {
				console.log(err)
				res.status(500).send(err)
			}
			else {
				let returnObjs = []
				inds.forEach((element, index, array) => {
					let newObj = element.toJSON()
					newObj.links = {}
					newObj.links.self = 'http://' + req.headers.host + '/api/inds/' + newObj._id
					returnObjs.push(newObj)
				})

				res.json(returnObjs)
			}
		})
	}


	let get = (req, res) => {

		let returnObj = req.individual.toJSON()
		returnObj.links = {}

		let newLink = 'http://' + req.headers.host + '/api/inds?breed=' + returnObj.breed._id
		returnObj.links.filterByThisBreed = newLink.replace(' ', '%20')

		newLink = 'http://' + req.headers.host + '/api/breeds/' + returnObj.breed._id
		returnObj.links.showBreed = newLink.replace(' ', '%20')

		res.json(returnObj)
	}


	let put = (req, res) => {
		req.individual.title = req.body.title
		req.individual.author = req.body.author
		req.individual.genre = req.body.genre
		req.individual.read = req.body.read

		req.individual.save((err) => {
			if (err) {
				res.status(500).send(err)
			}
			else {
				res.json(req.individual)
			}
		})
	}


	let patch = (req, res) => {
		if (req.body._id) {
			delete req.body._id
		}
		
		for (let p in req.body) {
			req.individual[p] = req.body[p]
		}

		req.individual.save((err) => {
			if (err) {
				res.status(500).send(err)
			}
			else {
				res.json(req.individual)
			}
		})
	}


	let del = (req, res) => {
		req.individual.remove((err) => {
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

module.exports = individualController

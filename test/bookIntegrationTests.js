
let should = require('should')
let request = require('supertest')

let app = require('../src/app.js')
let mongoose = require('mongoose')

let BreedModel = mongoose.model('Breed')
let agent = request.agent(app)


describe('Breed Crud Test', () => {

	it('Should allow a breed to be posted and return a name and _id', (done) => {
		let breedPost = {name: 'New Breed', type: 'milk'}

		agent.post('/api/breeds')
			.send(breedPost)
			.expect(200)
			.end((err, results) => {
				results.body.name.should.equal("New Breed")
				results.body.should.have.property('_id')
				done()
			})
	})

	afterEach((done) => {
		BreedModel.remove().exec()
		done()
	})

})


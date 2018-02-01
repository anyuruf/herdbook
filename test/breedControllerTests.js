
let should = require('should')
let sinon = require('sinon')

describe('Breed Controller Tests:', () => {

	describe('Post', () => {

		it('should not allow an empty name on post', () => {
			function BreedModel(book) {this.save = () => {}}

			console.log(typeof Breed)
			let req = {
				body: {
					namex: '',
					type: 'milk'
				}
			}

			let res = {
				status: sinon.spy(),
				send: sinon.spy()
			}

			let controller = require('../src/controllers/breedController')(BreedModel)

			controller.post(req, res)

			res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0])
			res.send.calledWith('Name is required').should.equal(true)
		})

	})

})



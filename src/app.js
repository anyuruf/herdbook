
let express = require('express')
let mongoose = require('mongoose')
let bodyParser = require('body-parser')


let db = null

if (process.env.ENV == 'Test') {
	db = mongoose.connect('mongodb://localhost/bookAPI_test')
}
else {
	db = mongoose.connect('mongodb://localhost/herdbook')
}


let app = express()

let port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


let BreedModel = require('./models/breedModel')
let breedRouter = require('./routes/breedRoutes')(BreedModel)
app.use('/api/breeds', breedRouter)

let IndividualModel = require('./models/individualModel')
let individualRouter = require('./routes/individualRoutes')(IndividualModel)
app.use('/api/inds', individualRouter)

let BirthModel = require('./models/birthModel')
let birthRouter = require('./routes/birthRoutes')(BirthModel)
app.use('/api/births', birthRouter)


app.get('/', (req, res) => {
	res.send('<h1>Welcome to my herdbook!</h1>')
})

app.listen(port, () => {
	console.log(`Express is listening on port ${port}`)
})

// used by supertest
module.exports = app

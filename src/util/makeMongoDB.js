
import mongoose from 'mongoose'
import Promise from 'bluebird'
import RRTBreedETL from './RRTBreedETL'
import RRTIndividualETL from './RRTIndividualETL'
import RRTBirthETL from './RRTBirthETL'
import getConfig from './config'


let config = getConfig()

//console.log(JSON.stringify(config, null, 4))

mongoose.Promise = Promise
mongoose.connect(config.database.connection)

let db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  console.log('opened.')

  new RRTBreedETL(config).runETL(db)
  .then(() => {
	  return new RRTIndividualETL(config).runETL(db)
  })
  .then(() => {
	  return new RRTBirthETL(config).runETL(db)
  })
  .then(() => {
    db.close(() => { 
      console.log('closing.')
  	})  	
  })

})


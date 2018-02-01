
import fs from 'fs'
import {forEach, filter} from 'ramda'
import yaml from 'js-yaml'
import path from 'path'
import mongo from 'mongodb'
import mongooseX from 'mongoose'
import Promise from 'bluebird'
import breedModel from '../models/breedModel'
import individualModel from '../models/individualModel'

let mongoose = Promise.promisifyAll(mongooseX);


export default class GoatETL {

  constructor(config) {
    this.srcDir = path.join(config.import.basePath, config.import.tables.individual)
  }

  //
  //  Generate the Web Database
  //
  runETL = (db) => {

    return new Promise((resolve, reject) => {

      let files = fs.readdirSync(this.srcDir)
      files = filter(((file) => file.endsWith('.yaml')), files)

      let allPromises = []
      let count = 0
      files.forEach((filename) => {
        try {
          let doc = yaml.safeLoad(fs.readFileSync(path.join(this.srcDir, filename), 'utf8'))
          count++

          let promise = breedModel.findOneAsync({rrid: doc.breedId})
            .then((breed) => {

              if (!breed) {
                console.log("null breed: ", doc)
              }
              doc.breed = breed._id
              individualModel.findOneAndUpdateAsync({rrid: doc.rrid}, {$set: doc}, {new: true, upsert: true})
            })

          allPromises.push(promise)
        }
        catch (e) {
          console.log(e)
        }
      })

      console.log(`Processing ${count} Individual records`)

      Promise.all(allPromises)
        .then(() => {
          console.log(`Individual records complete.`)
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
    })
  }

}

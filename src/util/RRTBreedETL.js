
import fs from 'fs'
import {values, forEach, filter} from 'ramda'
import yaml from 'js-yaml'
import path from 'path'
import mongo from 'mongodb'
import mongoose from 'mongoose'
import Promise from 'bluebird'
import breedModel from '../models/breedModel'

export default class BreedETL {

  constructor(config) {
    
    this.srcDir = path.join(config.import.basePath, config.import.tables.breed)
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
          let obj = yaml.safeLoad(fs.readFileSync(path.join(this.srcDir, filename), 'utf8'))
          count++

          let promise = breedModel.findOneAndUpdate({rrid: obj.rrid}, {$set: obj}, {new: true, upsert: true})

          allPromises.push(promise)
        }
        catch (e) {
          console.log(e)
        }
      })

      console.log(`Processing ${count} Breed records`)

      Promise.all(allPromises)
        .then(() => {
          console.log(`Breed records complete.`)
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
    })

  }

}

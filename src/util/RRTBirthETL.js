
import fs from 'fs'
import {forEach, filter} from 'ramda'
import yaml from 'js-yaml'
import path from 'path'
import mongo from 'mongodb'
import mongooseX from 'mongoose'
import Promise from 'bluebird'
import birthModel from '../models/birthModel'
import individualModel from '../models/individualModel'

let mongoose = Promise.promisifyAll(mongooseX);


export default class BirthETL {

  constructor(config) {
    this.srcDir = path.join(config.import.basePath, config.import.tables.birth)
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


          let promise = individualModel.findOneAsync({rrid: doc.dameId})
            .then((dame) => {
              if (dame) {
                doc.dame = dame._id
              }

              if (doc.sireId) {
                return individualModel.findOneAsync({rrid: doc.sireId})
              }
              else {
                return null
              }              
            })
            .then((sire) => {
              if (sire) {
                doc.sire = sire._id
              }

              if (doc.kidIds) {
                return individualModel.findAsync({rrid: doc.kidIds})
              }
              else {
                return null
              }              
            })
            .then((kids) => {
              if (kids) {
                doc.kids = []
                kids.forEach((kid) => {
                  doc.kids.push(kid._id)
                })
              }
              birthModel.findOneAndUpdateAsync({rrid: doc.rrid}, {$set: doc}, {new: true, upsert: true})
            })
            .catch((err) => {
              console.log(err)
            })


          allPromises.push(promise)
        }
        catch (e) {
          console.log(e)
        }
      })

      console.log(`Processing ${count} Birth records`)

      Promise.all(allPromises)
        .then(() => {
          console.log(`Birth records complete.`)
          resolve()
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
    })
  }

}

const express = require('express')
const router = express.Router()
const CodeModel = require('../Models/code')

// get a list of codes from the db
router.get('/code', (req, res, next) => {
  const tagArray = req.query.tags.split(' ').map(value => value.toLowerCase())
  console.log(req.query, tagArray)
  CodeModel.find({ searchWords: { $all: tagArray } }).limit( 40 ).then(code =>
    res.send(code)
  )
})

// get a list of codes from the db
router.get('/code/single/:id', (req, res, next) => {
  CodeModel.findOne({ _id: req.params.id })
    .then(code => res.send(code))
})

// add a new code to the db
router.post('/code', (req, res, next) => {
  console.log('post', req.body)
  CodeModel.create(req.body)
    .then(code => res.send(code))
    .catch(next)
})

// update a code in the db
router.put('/code/:id', (req, res, next) => {
  console.log('put request', req.params, req.body)
  CodeModel.findByIdAndUpdate({ _id: req.params.id }, req.body).then(() =>
    CodeModel.findOne({ _id: req.params.id }).then(code => res.send(code))
  )
})

// delete a code from the db
router.delete('/code/:id', (req, res, next) => {
  CodeModel.findByIdAndRemove({ _id: req.params.id }).then(code => {
    res.send(code)
  })
})

module.exports = router

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CodeSchema = new Schema({
  title: {
    type: String
  },
  link: {
    type: String
  },
  tags: [String],
  code: {
    type: String
  },
  domain: {
    type: String
  },
  searchWords: [String]
})

const CodeModel = mongoose.model('code', CodeSchema)

module.exports = CodeModel

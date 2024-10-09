/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGO_DB_URL

console.log('Connecting to url')
mongoose
  .connect(url)
  .then((res) => {
    console.log('Connected to DB')
  })
  .catch((err) => {
    console.log('Error connecting to DB:', err.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (n) => {
        return /^\d{2,3}-\d+$/.test(n)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)

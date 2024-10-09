/* eslint-disable no-unused-vars */
const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
morgan.token('body-logger', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body-logger'
  )
)
app.use(express.static('dist'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) return res.status(400).json({ error: 'Name is required' })

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((person) => {
      res.json(person)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      res.json(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  const date = new Date()
  Person.find({})
    .countDocuments()
    .then((count) => {
      res
        .send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
        .end()
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errHandler)

// app.delete('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   const person = persons.filter((person) => person.id !== id);

//   res.status(204).end();
// });

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`app listen on port ${PORT}`)
})

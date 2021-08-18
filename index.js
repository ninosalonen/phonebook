/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/Person.js')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('./client/build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :status :response-time ms :body'))
morgan.token('body', function (req, res) { return JSON.stringify(req.body)})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/health', (req, res) => {
  res.send('ok')
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    const len = persons.length
    res.send(`${len} people in phonebook,` + '\n' + new Date().toString())
  }).catch(e => next(e))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(e => next(e))
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person)
    }else{
      res.status(404).end()
    }
  }).catch(e => next(e))
})


app.delete('/api/persons/:id', (req,res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    }).catch(e => next(e))
})

app.post('/api/persons', (req,res,next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'no content'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(e => next(e))
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body
  const person = ({
    name: body.name,
    number: body.number
  })
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updated => {
      res.json(updated)
    }).catch(e => next(e))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')

morgan.token('body', (request, response) => JSON.stringify(request.body))
logger = morgan(':method :url :status :res[content-length] - :response-time ms - :body')
app = express()
app.use(express.static("build"))
app.use(express.json())
app.use(logger)
app.use(cors())

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(result=> {
      if (result) {
        response.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get("/info", (request, response) => {
  const time = new Date().toUTCString()
  Person.count({})
    .then(result => {
      response.send(
        `Phonebook has info for ${result} people <br />
        ${time}`
      )
    })
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  const person = new Person ({
    name: body.name,
    number: body.number,
  })
  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if ( error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

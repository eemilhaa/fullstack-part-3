require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./models/person')

morgan.token('body', (request, response) => JSON.stringify(request.body))
logger = morgan(':method :url :status :res[content-length] - :response-time ms - :body')
app = express()
app.use(express.json())
app.use(logger)
app.use(cors())
app.use(express.static("build"))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then(result=> {
      if (result) {
        responses.json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      response.status(500).end()
    })
})

app.get("/info", (request, response) => {
  const numberOfPersons = persons.length
  const time = new Date().toUTCString()
  response.send(
    `Phonebook has info for ${numberOfPersons} people <br />
    ${time}`
  )
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const id = Math.floor(Math.random() * 10000000)
  return id
}

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing"
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

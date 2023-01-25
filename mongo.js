const mongoose = require("mongoose")

const getArgs = () => {
  if (process.argv.length<3) {
    console.log("give password as argument")
    process.exit(1)
  }
  return {
    password: process.argv[2],
    name: process.argv[3],
    number: process.argv[4],
  }
}

const {password, name, number} = getArgs()

const url =
  `mongodb+srv://fullstack:${password}@cluster0.ooro7n6.mongodb.net/fullstack-3?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})
const Person = mongoose.model("Person", personSchema)

const addPerson = (name, number) => {
  const person = new Person({
    name: name,
    number: number,
    id: Math.floor(Math.random() * 10000000),
  })
  person
    .save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

const findAll = () => {
  Person.find({})
    .then(result => {
      console.log("phonebook:")
      result.forEach(person => {
        console.log(
          `${person.name} ${person.number}`
        )
      })
      mongoose.connection.close()
    })
}

if (!name || !number) {
  findAll()
} else {
  addPerson(name, number)
}

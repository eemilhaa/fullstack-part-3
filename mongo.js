const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://fullstack:${password}@cluster0.ooro7n6.mongodb.net/fullstack-3?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: "test",
  number: "123",
  id: 509183265,
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})

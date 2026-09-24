const express = require("express")
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('post-data', (req, res) => {
    if (req.method !== "POST") return
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) response.send(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) return response.status(400).send({ error: "name or number missing" })
    if (persons.find(person => person.name === body.name)) return response.status(400).send({ error: "name must be unique" })

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 65536).toString()
    }

    persons = persons.concat(person)

    return response.status(201).send(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
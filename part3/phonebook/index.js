require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('post-data', (req, res) => {
    if (req.method !== "POST") return
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.send(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(
            `<p>Phonebook has info for ${persons.length} people</p>
            <p>${Date()}</p>`
        )
    })
    
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.send(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) return response.status(400).send({ error: "name or number missing" })
    // if (persons.find(person => person.name === body.name)) return response.status(400).send({ error: "name must be unique" })

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`)
            response.status(201).send(result)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    Person.findById(request.params.id)
        .then(person => {
            if (!person) return response.status(404).end()
            
            person.name = name
            person.number = number

            return person.save().then(updatedPerson => {
                response.send(updatedPerson)
            })
        })
        .catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    console.error(error.name)

    if (error.name === "CastError") {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
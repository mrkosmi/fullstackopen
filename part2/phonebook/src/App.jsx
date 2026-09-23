import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')

  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationError, setNotificationError] = useState(false)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        const updatedPerson = { ...personToUpdate, number: newNumber }
        personService
          .update(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setNotificationError(false)
            setNotificationMessage(`${newName} updated successfully`)
            setPersons(persons.map(person => person.id === personToUpdate.id ? returnedPerson : person))
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setNotificationError(true)
            setNotificationMessage(`Information of ${newName} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== personToUpdate.id))
          })
      }
      return
    }

    const newPerson = { name: newName, number: newNumber , id: persons.length + 1}
    personService
      .create(newPerson)
      .then(returnedPerson => {
        setNotificationError(false)
        setNotificationMessage(`${newName} added successfully`)
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const removePerson = (id) => {
    if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
    console.log(`Deleting person with id ${id}`)
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
  }

  return (      
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} isError={notificationError} />
      <Filter filter={filter} setFilter={setFilter} />

      <h3>add a new</h3>
      <PersonForm 
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={removePerson} />
    </div>
  )
}

export default App
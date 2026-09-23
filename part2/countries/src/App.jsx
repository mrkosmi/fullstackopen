import { useState, useEffect } from 'react'
import { getAllCountries } from './services/countries'
import Info from './components/Info'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    getAllCountries()
      .then(countriesData => {
        console.log(countriesData)
        setCountries(countriesData)
      })
  }, [])

  const handleFilterChange = (event) => {
    const newFilter = event.target.value.toLowerCase()
    const newCountries = countries.filter(country => country.name.common.toLowerCase().includes(newFilter))
    console.log(newCountries)

    setFilter(newFilter)
    setFilteredCountries(newCountries)
  }

  const showCountry = country => {
    setFilteredCountries([country]) 
  }
  

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      <Info countries={filteredCountries} showCountry={showCountry} />
    </div>
  )
}

export default App
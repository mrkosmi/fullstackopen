import Country from "./Country"
import Countries from "./Countries"

const Info = ({ countries, showCountry }) => {
    if (countries.length > 1 && countries.length <= 10) {
        return <Countries countries={countries} showCountry={showCountry} />
    }

    if (countries.length > 10) {
        return <div> too many matches, specify another filter </div>
    }

    if (countries.length === 1) {
        const country = countries[0]
        return <Country country={country} />
    } 
    
    return <div> No matches </div>
}

export default Info
const Countries = ({ countries, showCountry }) => {
    return (
        countries.map(country => (
                <p key={country.name.common}>
                    {country.name.common} <button onClick={() => showCountry(country)}>show</button>
                </p>
        ))
        
    )
}

export default Countries
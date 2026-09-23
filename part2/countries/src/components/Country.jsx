import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <div>
            <h1> {country.name.common} </h1>
            <p> Capital {country.capital} </p>
            <p> Area {country.area} </p>
            <h2> Languages </h2>
            <ul>
                {Object.values(country.languages).map(language => <li key={language}> {language} </li>)}
            </ul>
            <img src={country.flags.png} alt={country.flags.alt} />
            <Weather name={country.capital[0]} lat={country.capitalInfo.latlng[0]} lon={country.capitalInfo.latlng[1]} />
        </div>
    )
}

export default Country
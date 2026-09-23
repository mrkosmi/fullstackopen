import { getWeather, getWeatherIcon } from '../services/weather'
import { useEffect, useState } from 'react'

const Weather = ({ name, lat, lon }) => {
    const [weather, setWeather] = useState(null)
    const [iconUrl, setIconUrl] = useState(null)

    useEffect(() => {
        getWeather(lat, lon)
            .then(weatherData => {
                setWeather(weatherData)
                setIconUrl(getWeatherIcon(weatherData.current.weather_code, weatherData.current.is_day))
            })
    }, [])

    if (weather === null) return null
    return (
        <div>
            <h2>Weather in {name}</h2>
            <p>Temperature {weather.current.temperature_2m} {weather.current_units.temperature_2m}</p>
            <img src={iconUrl} />
            <p>Wind {weather.current.wind_speed_10m} {weather.current_units.wind_speed_10m}</p>
        </div>
    )
}

export default Weather
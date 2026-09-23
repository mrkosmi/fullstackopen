import axios from 'axios'

export const getWeather = ( lat, lon ) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code,is_day`
    console.log(url)
    const request = axios.get(url)
    return request.then(response => {
        console.log(response)
        return response.data
    })
}

// https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c
const weatherCodesMap = {
    0: { "day": "01d", "night": "01n" },
    1: { "day": "01d", "night": "01n" },
    2: { "day": "02d", "night": "02n" },
    3: { "day": "03d", "night": "03n" },
    45: { "day": "50d", "night": "50n" },
    48: { "day": "50d", "night": "50n" },
    51: { "day": "09d", "night": "09n" },
    53: { "day": "09d", "night": "09n" },
    55: { "day": "09d", "night": "09n" },
    56: { "day": "09d", "night": "09n" },
    57: { "day": "09d", "night": "09n" },
    61: { "day": "10d", "night": "10n" },
    63: { "day": "10d", "night": "10n" },
    65: { "day": "10d", "night": "10n" },
    66: { "day": "10d", "night": "10n" },
    67: { "day": "10d", "night": "10n" },
    71: { "day": "13d", "night": "13n" },
    73: { "day": "13d", "night": "13n" },
    75: { "day": "13d", "night": "13n" },
    77: { "day": "13d", "night": "13n" },
    80: { "day": "09d", "night": "09n" },
    81: { "day": "09d", "night": "09n" },
    82: { "day": "09d", "night": "09n" },
    85: { "day": "13d", "night": "13n" },
    86: { "day": "13d", "night": "13n" },
    95: { "day": "11d", "night": "11n" },
    96: { "day": "11d", "night": "11n" },
    99: { "day": "11d", "night": "11n" }
}

export const getWeatherIcon = (weatherCode, isDay) => {
    const owmCode = weatherCodesMap[weatherCode][isDay === 1 ? 'day' : 'night']
    if (owmCode === null) return null

    return `https://openweathermap.org/img/wn/${owmCode}@2x.png`
}
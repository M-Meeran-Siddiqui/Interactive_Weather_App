/*
// Below code for api fetching from (openWeatherMap).
import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({});
    const [values, setValues] = useState([]);
    const [place, setPlace] = useState('Prayagraj');
    const [thisLocation, setLocation] = useState('');

    // Fetch weather from OpenWeatherMap API
    const fetchWeather = async () => {
        // console.log(import.meta.env.VITE_API_KEY)
        try {
            // Step 1: Convert location to lat/lon if required
            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=1&appid=${import.meta.env.VITE_API_KEY}`;
            const geoResponse = await axios.get(geoUrl);

            if (geoResponse.data.length === 0) {
                alert('This place does not exist');
                return;
            }

            const { lat, lon } = geoResponse.data[0];

            // Step 2: Fetch weather data using latitude and longitude
            const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${import.meta.env.VITE_API_KEY}`;

            const response = await axios.get(url);
            if (response.status === 200) {
                const data = response.data;
                const dailyData = data.daily.map(day => ({
                    temp: day.temp.day,
                    weather: day.weather[0].description,
                    date: new Date(day.dt * 1000).toLocaleDateString(),
                    feels_like: day.feels_like.day,
                    humidity: day.humidity,
                    wind_speed: day.wind_speed
                }));

                setLocation(place);         // Set location name
                setValues(dailyData);       // Store daily weather data
                setWeather(dailyData[0]);   // Set initial day's weather data for display
            } else {
                console.error(`Error fetching data: ${response.status} ${response.statusText}`);
                alert('Error fetching data from OpenWeatherMap.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('This place does not exist or data could not be fetched.');
        }
    };

    useEffect(() => {
        fetchWeather();  // Call fetchWeather when the component mounts
    }, [place]);

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
*/

//Below for RapidApi once-->
import { useContext, createContext, useState, useEffect } from "react";
import axios from 'axios'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('Prayagraj')
    const [thisLocation, setLocation] = useState('')

    // fetch api
    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
            }
        }

        try {
            const response = await axios.request(options);
            console.log(response.data)
            const thisData = Object.values(response.data.locations)[0]
            setLocation(thisData.address)
            setValues(thisData.values)
            setWeather(thisData.values[0])
        } catch (e) {
            console.error(e);
            // if the api throws error.
            alert('This place does not exist')
        }
    }

    useEffect(() => {
        fetchWeather()
    }, [place])

    useEffect(() => {
        console.log(values)
    }, [values])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)
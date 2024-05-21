import { useEffect, useState } from 'react'
import bgImg from './assets/bg4.jpg'
import _ from 'lodash'
import axios from 'axios'
import './App.css'
import Time from './time'
import DateComponent from './Date'

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/api/weather')
      .then((result) => {
        setWeatherData(result.data);
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
  }, []);

  return (
    <>
      <div className="bg">
        <img src={bgImg} alt="" />
      </div>

      <div className="container">

        <div className="box">

          <SearchBar />

          <div className="head">
            <h1>Today's Weather</h1>
            
            <DateComponent />
          </div>

          <div className="main">
            {weatherData && weatherData.place && (
              <>
                <p className="info">
                  {weatherData.place.name}
                </p>
                <span>
                  Min: {weatherData.weather.main.temp_min}&deg;C | Max: {weatherData.weather.main.temp_max}&deg;C
                </span>
                <p className="info">
                  {weatherData.weather.main.temp}&deg;C
                </p>
                <p>
                  Feels like: {weatherData.weather.main.feels_like}&deg;C
                </p>
                <p className="info">
                  {_.capitalize(weatherData.weather.weather[0].description)}
                </p>
                <p className="info">
                  Humidity: {weatherData.weather.main.humidity}
                </p>
              </>
            )}
            {error && <p>{error}</p>}
          </div>
        </div>

        <div className="box2" style={{ background: 'none' }}>

          <Time />

          <div className="forecasts">
            {weatherData && weatherData.forecasts ? (() => {
              const forecastElements = [];
              for (let i = 8; i < weatherData.forecasts.length; i = i + 8) {
                const forecast = weatherData.forecasts[i];
                let nextDate = new Date(forecast.dt * 1000);
                forecastElements.push(
                  <div className="cards" key={i}>
                    <p id="dates">{nextDate.toLocaleString('en-US', {
                      weekday: "short", day: "2-digit",
                      month: "short"
                    })}</p>
                    <p id="foreTemp">{forecast.main.temp}&deg;C</p>
                    <p id="foreDesc">{_.capitalize(forecast.weather[0].description)}</p>
                    <p id="foreHumid">Humidity: {forecast.main.humidity}</p>
                  </div>
                );

              }
              return forecastElements.length > 0 ? forecastElements : <p>No forecasts available</p>;
            })() : <p>LOADING...</p>}

          </div>
        </div>
      </div>
    </>
  );
}

function SearchBar() {
  const [searchInput, setSearchInput] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`http://127.0.0.1:3001/api/search`, {
        search: _.capitalize(searchInput)
      });

      const data = response.data;

      setWeatherData(data);
      setError(null);

    }
    catch (err) {
      console.log(err);
      setError(err.data);
      setWeatherData(null);
    }
  };

  return (
    <>
      <div className="searchform">

        <form onSubmit={handleSearch}>
          <input
            className="searchbar"
            type="text"
            placeholder="Enter to search a city"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoComplete="off"
            autoCapitalize="on"
          />
          <button className="searchbar" type="submit">Search</button>
        </form>

      </div>

    </>
  )
}

export default App

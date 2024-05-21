import express from 'express';
import axios from 'axios';
import cors from 'cors';
import _ from 'lodash';

const app = express();
const port = process.env.PORT || 3000;
// const hostname = '127.0.0.1';
const apiKey = "16c4c78266a7343d3cd9e75b95ee98e1";
let country_code = "IN";
let city_name = "Delhi";

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://weather-forecasting-app-gold.vercel.app');
  next();
});
app.use(express.json());
app.use(cors());


app.get('/api/weather', async (req, res) => {
    try {
        let place = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city_name},${country_code}&limit=1&appid=${apiKey}`);

        if (_.isEmpty(place.data)) {
            console.log("No match found");
            city_name = "Delhi";
            return res.json({
                error: "No match found"
            })
        }

        const lat = place.data[0].lat;
        const lon = place.data[0].lon;

        let currentWeather = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        let forecast = axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);

        const result = await Promise.all([currentWeather, forecast]);
        // result[0] => current weather data
        // result[1] => forecast data

        return res.json({
            weather: result[0].data,
            place: place.data[0],
            forecasts: result[1].data.list 
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/search", async (req, res) => {
    try {
        city_name = req.body.search;
        res.redirect("/api/weather");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    // console.log('Listening at http://' + hostname + ":" + port);
    console.log('Server started');
});

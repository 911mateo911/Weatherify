const express = require("express");
const axios = require("axios");
const apiKeys = require(__dirname + "/apiKeys.js");
const refineName = require(__dirname + "/refineCity.js")
const city = require(__dirname + "/getCities.js")
const searchCities = require(__dirname + "/searchCities.js")
const app = express();
app.use(express.static("public"));
let citiesArray = [];

async function getCities() {
  const cities = await axios.get(apiKeys.cityApiHeaders().endPoint, {
    headers: {
      "X-Parse-Application-Id": apiKeys.cityApiHeaders().id,
      "X-Parse-REST-API-Key": apiKeys.cityApiHeaders().key
    }
  });
  return cities.data;
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/cities/get/", async (req, res) => {
  try {
    const citiesList = await city.getCities();
    const citiesSaved = await searchCities.saveCities(citiesList)
    citiesArray = citiesSaved;
    res.send(citiesList);
  } catch (e) {
    console.log(e);
  }
});

app.post("/:cityID", async (req, res) => {
  const cityId = req.params.cityID;
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${refineName.refinedCity(cityId)}&appid=${apiKeys.weatherApiKey()}&units=metric`;
  try {
    const weather = await axios.get(apiURL);
    res.send(weather.data);
  } catch (e) {
    console.log(e);
  }
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started at port 3000");
});

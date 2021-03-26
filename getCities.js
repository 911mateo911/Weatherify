const apiKeys = require(__dirname + "/apiKeys.js");
const axios = require("axios");

exports.getCities = async function getCities() {
    const cities = await axios.get(apiKeys.cityApiHeaders().endPoint, {
        headers: {
            "X-Parse-Application-Id": apiKeys.cityApiHeaders().id,
            "X-Parse-REST-API-Key": apiKeys.cityApiHeaders().key
        }
    });
    return cities.data;
}
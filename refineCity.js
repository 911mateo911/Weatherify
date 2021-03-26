exports.refinedCity = function (city) {
    let refinedCity = ""
    if (city.includes("ë") && city.includes("ç")) {
        let halfRefined = city.replace("ë", "e");
        refinedCity = halfRefined.replace("ç", "c");
    } else if (city.includes("ç")) {
        refinedCity = city.replace("ç", "c");
    } else if (city.includes("ë")) {
        refinedCity = city.replace("ë", "e");
    } else {
        refinedCity = city;
    }
    return refinedCity
}
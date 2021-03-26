exports.saveCities = function (data) {
  const array = []
  for (cities of data.results) {
    if (!cities.name.includes("-")) {
      if (cities.population !== 22679) {
        array.push(cities.name);
      }
    } else if (cities.name === "fier" || "Fushë-Krujë") {
    } else {
      let index = cities.name.indexOf("-");
      let newName = cities.name.slice(0, index);
      array.push(newName);
    }
  }
  return array
}
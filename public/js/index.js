// animate class
class DotsAnimation {
  async anim() {
    await this.timeout(1);
    await this.timeout(2);
    await this.timeout(3);
  }

  timeout(num) {
    return new Promise((resolve) => {
      document
        .querySelector(`.circle:nth-of-type(${num})`)
        .classList.add("animate");
      setTimeout(() => {
        document
          .querySelector(`.circle:nth-of-type(${num})`)
          .classList.remove("animate");
        resolve();
      }, 600);
    });
  }

  stopAnim() {
    document.querySelector("#loading").remove();
    isIntervalRunning = false;
  }

  animate() {
    let id = setInterval(() => {
      if (isIntervalRunning) {
        this.anim();
      } else {
        clearInterval(id);
      }
    }, 1800);
  }
}

// Pasting data from json
class PastingData {
  pasteData(data, where) {
    for (let cities of data) {
      if (!cities.name.includes("-")) {
        if (cities.population !== 22679) {
          createAndAppend(cities.name, where);
          citiesArray.push(cities.name.toLowerCase())
        }
      } else if (cities.name === "fier" || "Fushë-Krujë") {
      } else {
        let index = cities.name.indexOf("-");
        let newName = cities.name.slice(0, index);
        createAndAppend(newName, where);
        citiesArray.push(newName.toLowerCase())
      }
    }
  }

  pasteSpecificData(...args) {
    this.q(
      `${args[0]}`
    ).src = `https://openweathermap.org/img/wn/${args[1]}@2x.png`;
    this.q(`${args[2]}`).innerHTML = args[3];
    this.q(`${args[4]}`).innerHTML = this.roundNum(args[5]) + "°C";
    this.q(`${args[6]}`).innerHTML = `Feels like ${this.roundNum(args[7])}°C`;
    const specificother = this.qAll(`${args[8]}`);
    specificother[0].innerHTML = args[9] + " km/h";
    specificother[1].innerHTML = args[10] + "%";
    specificother[2].innerHTML = args[11] + " mbar";
    const othertemp = this.qAll(`${args[12]}`);
    othertemp[0].innerHTML = this.roundNum(args[13]) + "°C";
    othertemp[1].innerHTML = this.roundNum(args[14]) + "°C";
  }

  q(element) {
    return document.querySelector(element);
  }

  qAll(element) {
    return document.querySelectorAll(element);
  }

  roundNum(number) {
    return Math.round(number * 10) / 10;
  }

  hideLoading(who1, who2, who3) {
    this.q(who1).classList.remove("invisible");
    this.q(who2).classList.remove("invisible");
    this.q(who3).style.display = "none";
  }
}

// getting and pasting tiranas weather
class TiranaWeather extends PastingData {
  async getTiranaWeather() {
    try {
      const weather = await fetch("/Tirana", { method: "Post" });
      const data = await weather.json();
      await this.pasteTiranasWeather(
        data.weather[0].icon,
        data.weather[0].main,
        data.main.temp,
        data.main.feels_like,
        data.wind.speed,
        data.main.humidity,
        data.main.pressure
      );
    } catch (e) {
      console.log(e);
    }
  }

  pasteTiranasWeather(icon, mood, temp, feels, wind, humidity, pressure) {
    this.q(
      ".tiranaimg"
    ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    this.q(".tiranamood").innerHTML = mood;
    this.q(".tiranatmp").innerHTML = temp + "°C";
    this.q(".tiranafeels").innerHTML = feels + "°C";
    const tempTir = this.qAll(".tempTir");
    tempTir[0].innerHTML = wind + "km/h";
    tempTir[1].innerHTML = humidity + "%";
    tempTir[2].innerHTML = pressure + "mbar";
    this.hideLoading(".tiranatxt", ".tiranatemp", ".loader");
  }
}

//Declarations and function calls
let dotsAnim = new DotsAnimation();
let tiranaWeather = new TiranaWeather();
let paste = new PastingData();
const citiesArray = []
tiranaWeather.getTiranaWeather();
getCityList();
dotsAnim.anim();
dotsAnim.animate();

document.querySelector(".goback").addEventListener("click", () => {
  paste.q("#specificWeather").classList.remove("rightShow");
  paste.q("#specificWeather").classList.add("hideanim");
  paste.q("body").style.overflow = "auto";
  paste.q(".mainnoimg").classList.add("invisible");
  paste.q(".mainwimg").classList.add("invisible");
  paste.q(".specother").classList.add("invisible");
  paste.q(".otherdata").classList.add("invisible");
  paste.q(".loader2").style.display = "initial";
});

paste.q("nav img").addEventListener("click", () => {
  const searchcont = paste.q(".searchcontainer")
  searchcont.classList.remove("hideanim")
  searchcont.classList.add("rightShow")
  const body = paste.qAll("section")
  paste.q("#cities").classList.add("blur")
  for (let elements of body) {
    elements.classList.add("blur")
  }
})

paste.q(".searchbox img").addEventListener("click", goBackFromSearch)

function goBackFromSearch() {
  const searchcont = paste.q(".searchcontainer")
  searchcont.classList.add("hideanim")
  searchcont.classList.remove("rightShow")
  const body = paste.qAll("section")
  paste.q("#cities").classList.remove("blur")
  for (let elements of body) {
    elements.classList.remove("blur")
  }
}

paste.q(".searchbox input").addEventListener("input", async function () {
  let childs = paste.qAll(".searchResults .city");
  for (all of childs) {
    all.remove()
  }
  let filteredArray = citiesArray.filter((name) => {
    return name.startsWith(this.value.toLowerCase())
  })
  if (filteredArray.length != 0) {
    if (paste.q(".searchResults h4")) {
      paste.q(".searchResults h4").remove()
    }
    for (city of filteredArray) {
      let firstLetter = city[0].toUpperCase()
      let other = city.slice(1, city.length)
      createAndAppend(firstLetter + other, ".searchResults")
      addEvents()
    }
    const searchResults = paste.q(".searchResults")
    searchResults.style.maxHeight = "65vh"
    searchResults.style.overflow = "auto"
  } else {
    if (paste.qAll(".searchResults h4").length == 0) {
      const div = paste.q(".searchResults")
      const p = document.createElement("h4")
      p.style.fontFamily = "Open Sans"
      p.innerHTML = "No city found"
      div.appendChild(p)
    }
  }
})

let isIntervalRunning = true;

// functions
async function getCityList() {
  try {
    const list = await fetch("/cities/get/", { method: "Post" });
    const data = await list.json();
    await dotsAnim.stopAnim();
    await paste.pasteData(data.results, "#cities");
    addEvents();
    paste.q("#cities").classList.remove("invisible");
  } catch (e) {
    console.log(e);
  }
}

function createAndAppend(name, where) {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const p = document.createElement("p");
  const main = document.querySelector(where);
  div.classList.add("city");
  p.innerHTML = name;
  p.classList.add("qytet");
  img.src = "images/next.svg";
  div.appendChild(p);
  div.appendChild(img);
  div.classList.add(name);
  main.appendChild(div);
}

function addEvents() {
  let buttons = document.querySelectorAll(".city");
  for (button of buttons) {
    button.addEventListener("click", async function () {
      paste.q("#specificWeather").classList.add("rightShow");
      paste.q(".cityName").innerHTML = this.classList[1];
      paste.q("#specificWeather").classList.remove("hideanim");
      paste.q("body").style.overflow = "hidden";
      const searchcont = paste.q(".searchcontainer")
      searchcont.classList.add("hideanim")
      searchcont.classList.remove("rightShow")
      const body = paste.qAll("section")
      paste.q("#cities").classList.remove("blur")
      for (let elements of body) {
        elements.classList.remove("blur")
      }
      try {
        const specific = await fetch(`/${this.classList[1]}`, {
          method: "Post",
        });
        const data = await specific.json();
        await paste.pasteSpecificData(
          ".specificPic",
          data.weather[0].icon,
          ".specificdesc",
          data.weather[0].main,
          ".specificTemp",
          data.main.temp,
          ".specificfeel",
          data.main.feels_like,
          ".tempcit",
          data.wind.speed,
          data.main.humidity,
          data.main.pressure,
          ".othertemp",
          data.main.temp_max,
          data.main.temp_min
        );
        await paste.hideLoading(".mainwimg", ".mainnoimg", ".loader2");
        await paste.hideLoading(".specother", ".otherdata", ".loader3")
      } catch (e) {
        console.log(e);
      }
    });
  }
}

const key = "d142efa0b1d90151c8498d033f93b9ec"; //our key in a website to access the weather data
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric"; // the api for weather data
let cityName = "philippines";

const weatherData = async () => {
  try {
    const response = await fetch(apiUrl + `&q=${cityName}` + `&appid=${key}`); //calling the api with our key to access it
    const data = await response.json();
    if (data.cod !== 200) {
      throw new Error(data.message || "City not Found");
    }

    const city = data.name;
    const celsius = Math.trunc(data.main.temp); //math.trunc() remove decimal
    const weatherStatus = data.weather[0].main;
    const humidity = Math.trunc(data.main.humidity);
    const wind = Math.trunc(data.wind.speed);
    updateStatus(city, celsius, weatherStatus, humidity, wind); //calling a function for manipulating a dom
  } catch (err) {
    //updating dom if it gets an error
    console.log(`failed to fetch - ${err}`);
    $("#country-name").text("City Not Found");
    $("#celsius").text("");
    $("#weather-status").text("");
    $("#other-status").removeClass("other-status").addClass("none"); //remove the element if gets an error
    $("#status-icon").attr("src", "./image/error.png");
  }
};

const updateStatus = (city, celsius, weatherStatus, humidity, wind) => {
  $("#other-status").removeClass("none").addClass("other-status"); //showing again the other status if error didn't occur
  $("#country-name").text(city);
  $("#celsius").text(`${celsius} °C`);
  $("#weather-status").text(`${weatherStatus}`);
  $("#humidity").text(`${humidity}%`);
  $("#wind").text(`${wind} Km/h`);

  //checking the status to update the dom with img logo
  switch (weatherStatus) {
    case "Clear":
      $("#status-icon").attr("src", "./image/sunny.png");
      break;
    case "Clouds":
      $("#status-icon").attr("src", "./image/cloudy.png");
      break;
    case "Rain":
      $("#status-icon").attr("src", "./image/rainy.png");
      break;
    case "Drizzle":
      $("#status-icon").attr("src", "./image/drizzle.png");
      break;
    case "Mist":
      $("#status-icon").attr("src", "./image/mist.png");
      break;
  }
};

$(".search-button").click(async (event) => {
  event.preventDefault(); // Prevent form submission if inside a form
  cityName = $("#searchCountry").val(); //assigning the cityName a value before calling the weatherData function so we have an value for the city that we search
  console.log(cityName);
  await weatherData();
  $("#searchCountry").val("");
});

$("#searchCountry").keypress(async (event) => {
  if (event.which === 13) {
    // Enter key code is 13
    event.preventDefault(); // Prevent form submission if inside a form
    cityName = $("#searchCountry").val();
    await weatherData();
    $("#searchCountry").val("");
  }
});

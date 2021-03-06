const sectionWeather = document.querySelector(".weather-section");
const containerWeather = document.querySelector(".weather-container");
const form = document.querySelector(".search-form");
const errorMessages = document.querySelector(".error-messages");
const searchInput = document.querySelector(".input-search");
const body = document.querySelector("body");
const errorMessage = document.querySelector('.error-message');

form.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather(searchInput.value);
});

const throwError = function (error) {
  errorMessage.innerHTML = error;
  errorMessage.style.opacity = '100';
};

sectionWeather.addEventListener("click", function (e) {
  e.preventDefault();
  if (!e.target.classList.contains("remove")) return;
  e.target.closest("div").remove();
});

const getWeather = async function (country) {
  try {
    // Get Country
    const resCoords = await fetch(
      `https://restcountries.com/v2/name/${country}`
    );
    if (!resCoords.ok)return throwError('Country not found!');

    if (resCoords.ok) errorMessage.style.opacity = '0';
    const dataCoords = await resCoords.json();
    console.log(dataCoords[0].capital);

    const [lat, lng] = dataCoords[0].latlng;

    // Get weather
    const resWeather = await fetch(
      `http://www.7timer.info/bin/api.pl?lon=${lng}&lat=${lat}&product=civil&output=json`
    );
    if (!resWeather.ok) return throwError(`Couldn't get weather!`);
    
    if (resWeather.ok) errorMessage.style.opacity = '0';
    const dataWeather = await resWeather.json();
    console.log(dataWeather);
    console.log(dataWeather.dataseries[0]);
    // return dataWeather.dataseries[0];
    const html = `
        <div class="weather-container">
        <h2>${dataCoords[0].name}</h2>
        <p class="temperature-data">${
          dataWeather.dataseries[0].temp2m > 1
            ? '<ion-icon name="sunny-outline" class="icon sunny"></ion-icon>'
            : '<ion-icon name="snow-outline" class="icon cold"></ion-icon>'
        }${dataWeather.dataseries[0].temp2m}&deg;C</p>
        <p>09.03.2022</p>
        <button class="btn remove-btn remove"><ion-icon name="trash-outline" class="icon remove"></ion-icon></button>        
        </div>`;
    sectionWeather.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error(err.message);
  }
};

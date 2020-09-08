const apiKey = "1f851222062e779b9c6638e3f1739e8e";
const baseURL = "https://api.openweathermap.org/data/2.5/weather";
const loader = document.getElementById('loader');
const main = document.getElementById('main');
const form = document.querySelector('.form');

loader.hidden = true;
let searchTerm = '';



getSavedData();

async function fetchWeather(city){
main.style.visibility = 'hidden';
loader.hidden = false;
const API = `${baseURL}?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const res = await fetch(API);
    const data = await res.json();
    console.log(data)
    if(data.cod === 200) {
      loader.hidden = true;
      main.style.visibility = 'visible';
      localStorage.setItem('data', JSON.stringify(data));
      displayWeather(data);
    } else {
      loader.hidden = true;
      alert(data.message.toUpperCase());
      getSavedData();
    }
  } catch(error) {
    console.log(error);
  }
}


function getWeather(e){
  e.preventDefault();
  searchTerm = e.srcElement[0].value;
  fetchWeather(searchTerm);
  e.srcElement[0].value = "";
}

function getSavedData(){
    if(JSON.parse(localStorage.getItem('data'))){
      main.style.visibility = 'visible';
     displayWeather(JSON.parse(localStorage.getItem('data')))
  }
}

form.addEventListener('submit', getWeather);


function displayWeather (weather) {
  let city = document.querySelector('.city');
  city.innerText = `${weather.name} Weather Report`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = showDate(now);

  let icon = document.querySelector('.current .icon');
  icon.src = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${weather.main.temp}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].description;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${weather.main.temp_min}°c / ${weather.main.temp_max}°c`;
}



function showDate (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

// PWA

if("serviceWorker" in navigator){
  navigator.serviceWorker.register('/sw.js').then(res => {
  }).catch(error => console.log(error));
}
const apiKey = "903788d4e72a1dfd6ae68cf563b856c5";

// DOM elements
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherContainer = document.getElementById("weatherContainer"); // ✅ Correct ID
const themeToggle = document.getElementById("themeToggle");
const loadingMsg = document.getElementById("loading");
const errorMsg = document.getElementById("error");

// Get weather data
async function getWeather(city) {
  loadingMsg.classList.remove("hidden");
  weatherContainer.classList.add("hidden");
  errorMsg.textContent = "";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();
    displayWeather(data);
  } catch (err) {
    errorMsg.textContent = err.message;
  } finally {
    loadingMsg.classList.add("hidden");
  }
}

// Display weather data
function displayWeather(data) {
  const {
    name,
    main: { temp, feels_like, humidity },
    weather,
    wind: { speed },
    sys: { country },
  } = data;

  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const description = weather[0].description;

  document.getElementById("cityName").textContent = `${name}, ${country}`;
  document.getElementById("localTime").textContent = new Date().toLocaleString();
  document.getElementById("weatherIcon").src = icon;
  document.getElementById("weatherIcon").alt = description;
  document.getElementById("description").textContent = description;
  document.getElementById("temp").textContent = temp;
  document.getElementById("feelsLike").textContent = feels_like;
  document.getElementById("humidity").textContent = humidity;
  document.getElementById("wind").textContent = speed;

  weatherContainer.classList.remove("hidden");
}

// Search button click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
  else alert("Please enter a city name.");
});

// Enter key triggers search
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Apply saved theme
// Set dark mode as default
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙";
  } else {
    // Default to dark
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
    localStorage.setItem("theme", "dark"); // Save preference
  }
});

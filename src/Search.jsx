import { useState } from "react";
import './Search.css';

//Verificar porque backgrounds não estão funcionando


function Search() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null); // novo estado para mensagens de erro
  const [background, setBackground] = useState("default");


  async function searchInput(e) {
    e.preventDefault();
    const currentValue = e.target.elements.searchInput.value.trim();

    if (!currentValue) {
      setError("You need to search for a city...");
      setData(null);
      setBackground("default");
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${currentValue}&units=metric&appid=20c8b3aafca212e00195c87f82600683`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      // Se a cidade não for encontrada (código 404)
      if (data.cod === "404" || data.cod === 404) {
        setError("City not found 😕");
        setData(null);
        setBackground("default");
        return;
      }

      // Se tudo der certo
      if (data?.main && data?.weather && data?.sys) {
        const weatherType = data.weather[0].main.toLowerCase(); // "Clear", "Clouds", "Rain"...
        const iconCode = data.weather[0].icon;

        // Determine if it's night
        const isNight = iconCode.includes("n");

        let bgClass = weatherType.toLowerCase();
        if (isNight) bgClass += "-night";
        
        // Time calculations
        const timezoneOffset = data.timezone; // in seconds
        const localTime = new Date((data.dt + timezoneOffset) * 1000);
        const hours = localTime.getUTCHours().toString().padStart(2, "0");
        const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");

        setData({
          temp: data.main.temp,
          city: data.name,
          country: data.sys.country,
          description: data.weather[0].description,
          iconCode: data.weather[0].icon,
          time: `${hours}:${minutes}`,
          isNight,
        });

        setError(null);
        setBackground(bgClass);
}
    } catch {
      setError("Error when searching for a city. Try again later.");
      setData(null);
      setBackground("default");
    }
  }


    function toTitleCase(str) {
      if (!str) return "";
      return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    }




  return (
    
    <div className={`searchWrapper ${background}`}>
      <div className="container">


        {!data && !error && (
          <div className="defaultScreen">
                <img src="/Icons/01d.svg" alt="default weather" className="defaultIcon" />
            <h2>Welcome to My Weather App</h2>
            <p>Type a city name below and press Enter 😉</p>
          </div>
        )}


        <div className="searchForm">
          <form onSubmit={searchInput}>
            <input placeholder="Search city..." type="text" name="searchInput" />
          </form>
        </div>

        {error && <div className="errorMsg">{error}</div>}

        {data ? (
          <div className="dataWrapper">
            <div className="information">
              <div className="temp"> {Math.round(data.temp)}°C</div>
              <div className="location">
                <div className="icons_2">📌</div>{data.city}, {data.country}
              </div>
              <div className="time"><div className="icons_2">🕔</div> Local time: {data.time}</div>
              <div className="description">{toTitleCase(data.description)}</div>
              </div>
                {data && <img src={`/Icons/${data.iconCode}.svg`} alt={data.description} className="icon" />}
            </div>
        ) : null}
      </div>
    </div>
    
  );
}

export default Search;

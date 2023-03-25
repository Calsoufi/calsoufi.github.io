function onSuccess(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getNearestAirport(latitude, longitude);
  }
  
  function onError(error) {
    console.error("Error fetching location:", error);
    document.getElementById("nearest-airport").textContent = "Error fetching location";
  }
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    document.getElementById("nearest-airport").textContent = "Geolocation not supported";
  }
  
  async function getNearestAirport(latitude, longitude) {
    const url = `https://opensky-network.org/api/airports?lat=${latitude}&lng=${longitude}&radius=100`;
  
    try {
      const response = await fetch(url);
      const airports = await response.json();
  
      if (airports && airports.length > 0) {
        const nearestAirport = airports[0];
        document.getElementById("nearest-airport").textContent = `Nearest airport: ${nearestAirport.name}, (${nearestAirport.iata})`;
        getCheapestFlight(nearestAirport.iata);
      } else {
        document.getElementById("nearest-airport").textContent = "No airports found nearby";
      }
    } catch (error) {
      console.error("Error fetching airport data:", error);
      document.getElementById("nearest-airport").textContent = "Error fetching airport data";
    }
  }
  

  async function getCheapestFlight(originAirportIata) {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    const url = `https://api.skypicker.com/flights?fly_from=${originAirportIata}&date_from=${today}&date_to=${tomorrow}&partner=bxGuSk0emsu98ICPnP77JtPu-HIBHE7z`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.data && data.data.length > 0) {
        const cheapestFlight = data.data.reduce((min, flight) => (flight.price < min.price ? flight : min), data.data[0]);
        document.getElementById("cheapest-flight").textContent = `Cheapest flight: ${originAirportIata} to ${cheapestFlight.flyTo} (${cheapestFlight.cityTo}) - $${cheapestFlight.price}`;
      } else {
        document.getElementById("cheapest-flight").textContent = "No flights found";
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      document.getElementById("cheapest-flight").textContent = "Error fetching flight data";
    }
  }
  
document.getElementById("airport-form").addEventListener("submit", (event) => {
    event.preventDefault();
  
    const airportIata = document.getElementById("airport-input").value;
    getCheapestFlight(airportIata);
  });
  
  async function getCheapestFlight(originAirportIata) {
    const today = new Date().toISOString().split("T")[0];
    const apiUrl = `https://api.duffel.com/air/offers?origin=${originAirportIata}&departure_date=${today}`;
    

    
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Duffel-Version': '1.0.0',
          'Authorization': `Bearer duffel_test_MkMm0lKf_DFDeJfEUleAlHw-dVWWHbMB2BqPwv1LTgn`,
        },
      });
      const data = await response.json();
  
      if (data.data && data.data.length > 0) {
        const cheapestFlight = data.data.reduce((min, flight) => (flight.price.total_amount < min.price.total_amount ? flight : min), data.data[0]);
        document.getElementById("cheapest-flight").textContent = `Cheapest flight: ${originAirportIata} to ${cheapestFlight.destination} (${cheapestFlight.destination}) - $${cheapestFlight.price.total_amount}`;
      } else {
        document.getElementById("cheapest-flight").textContent = "No flights found";
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      document.getElementById("cheapest-flight").textContent = "Error fetching flight data";
    }
  }
  
  
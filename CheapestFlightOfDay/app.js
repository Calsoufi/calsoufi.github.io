document.getElementById("airport-form").addEventListener("submit", (event) => {
    event.preventDefault();
  
    const airportIata = document.getElementById("airport-input").value;
    getCheapestFlight(airportIata);
  });
  

  const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';

  async function getCheapestFlight(originAirportIata) {
    const today = new Date().toISOString().split("T")[0];
  
    // Step 1: Create Offer Request
    const offerRequestUrl = `${corsAnywhereUrl}https://api.duffel.com/air/offer_requests`;
    const requestBody = {
      "data": {
        "cabin_class": "economy",
        "departure_date": today,
        "destination": "anywhere",
        "origin": originAirportIata
      }
    };
  
    try {
      const offerRequestResponse = await fetch(offerRequestUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Duffel-Version': 'v1',
          'Authorization': `Bearer duffel_test_MkMm0lKf_DFDeJfEUleAlHw-dVWWHbMB2BqPwv1LTgn`,
        },
        body: JSON.stringify(requestBody)
      });
      const offerRequestData = await offerRequestResponse.json();
      console.log("Offer Request Data:", offerRequestData); // Add this line to log the response data

      const offerRequestId = offerRequestData.data.id;
  
      // Step 2: Fetch Offers
      const offersUrl = `${corsAnywhereUrl}https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}`;
      const offersResponse = await fetch(offersUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Duffel-Version': 'v1',
          'Authorization': `Bearer duffel_test_MkMm0lKf_DFDeJfEUleAlHw-dVWWHbMB2BqPwv1LTgn`,
        },
      });
      const offersData = await offersResponse.json();
  
      if (offersData.data && offersData.data.length > 0) {
        const cheapestFlight = offersData.data.reduce((min, flight) => (flight.price.total_amount < min.price.total_amount ? flight : min), offersData.data[0]);
        document.getElementById("cheapest-flight").textContent = `Cheapest flight: ${originAirportIata} to ${cheapestFlight.destination} (${cheapestFlight.destination}) - $${cheapestFlight.price.total_amount}`;
      } else {
        document.getElementById("cheapest-flight").textContent = "No flights found";
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      document.getElementById("cheapest-flight").textContent = "Error fetching flight data";
    }
  }
  
  
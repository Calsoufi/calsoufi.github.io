var offers; // Add this line to declare the offers variable
var selectedOffer; // Add this line to declare the offers variable
var passengerdetails; // Add this line to declare the offers variable


document.getElementById("airport-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const airportInput = document.getElementById("airport-input");
  const originAirportIata = airportInput.value.toUpperCase();
  await getCheapestFlight(originAirportIata);
});


function displayOffers(offers) {
  const offersContainer = document.getElementById("cheapest-flight");
  offersContainer.innerHTML = "";

  offers.forEach((offer, index) => {
    const offerElement = document.createElement("div");
    //offerElement.classList.add("mb-3");
    offerElement.classList.add("offer-card"); // Add the 'offer-card' class
    offerElement.setAttribute("data-offer-index", index); // Set a data attribute to identify the offer index


    const departureDate = new Date(offer.slices[0].segments[0].departing_at);
    const arrivalDate = new Date(offer.slices[0].segments[0].arriving_at);

    const departureDateString = departureDate.toLocaleDateString() + ' ' + departureDate.toLocaleTimeString();
    const arrivalDateString = arrivalDate.toLocaleDateString() + ' ' + arrivalDate.toLocaleTimeString();

    const offerDetails = `
        <h3>Offer ${index + 1}</h3>
        <button class="selected-button material-icons">done</button>
        <p><i class="material-icons">attach_money</i> Total amount: ${offer.total_amount} ${offer.total_currency}</p>
        <p><i class="material-icons">flight_takeoff</i> Departing at: ${departureDateString}</p>
        <p><i class="material-icons">flight_land</i> Arriving at: ${arrivalDateString}</p>
        <p><i class="material-icons">schedule</i> Duration: ${offer.slices[0].duration}</p>
        <p><i class="material-icons">airplanemode_active</i> Airline: ${offer.owner.name}</p>
      `;

    offerElement.innerHTML = offerDetails;
    offersContainer.appendChild(offerElement);

    // Attach a click event listener to the offer element
    offerElement.addEventListener("click", () => {
      // Remove the 'selected' class from all offer elements
      const selectedOfferElements = document.querySelectorAll(".offer-card.selected");
      selectedOfferElements.forEach(selectedOfferElement => {
        selectedOfferElement.classList.remove("selected");
      });

      // Add the 'selected' class to the clicked offer element
      offerElement.classList.add("selected");
      selectedOffer = offer.id;

      // Show the passenger details form
      const passengerDetailsForm = document.getElementById("passenger-details-form");
      passengerDetailsForm.style.display = "block";

      // Handle form submission
      const formSubmitButton = document.getElementById("form-submit-button");
      formSubmitButton.addEventListener("click", async () => {
        // Get passenger details from form
        const firstNameInput = document.getElementById("first-name-input");
        const lastNameInput = document.getElementById("last-name-input");
        const emailInput = document.getElementById("email-input");
        const phoneInput = document.getElementById("phone-input");
        const passengerDetails = {
          first_name: firstNameInput.value,
          last_name: lastNameInput.value,
          email: emailInput.value,
          phone_number: phoneInput.value,
        };

        // Create order with selected offer and passenger details
        const order = await createOrder(offer.id, passengerDetails);

        // Redirect user to Duffel's checkout page to complete the booking
        window.location.href = order.links.checkout_url;
      });

    });
  });
}




const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';

async function getCheapestFlight(originAirportIata) {
  const today = new Date().toISOString().split("T")[0];

  // Step 1: Create Offer Request
  const offerRequestUrl = `https://api.duffel.com/air/offer_requests`;
  const requestBody = {
    "data": {
      "slices": [
        {
          "origin": "GVA",
          "destination": "JFK", // You should replace "JFK" with your desired destination IATA code
          "departure_date": today
        }
      ],
      "cabin_class": "economy",
      "passengers": [
        {
          "type": "adult"
        }
      ]
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
        'Access-Control-Allow-Origin': 'https://calsoufi.github.io, http://localhost:5500'
      },
      body: JSON.stringify(requestBody)
    });
    const offerRequestData = await offerRequestResponse.json();
    console.log("Offer Request Data:", offerRequestData); // Add this line to log the response data

    const offerRequestId = offerRequestData.data.id;

    // Step 2: Fetch Offers
    const offersUrl = `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}`;
    const offersResponse = await fetch(offersUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'v1',
        'Authorization': `Bearer duffel_test_MkMm0lKf_DFDeJfEUleAlHw-dVWWHbMB2BqPwv1LTgn`,
        'Access-Control-Allow-Origin': 'https://calsoufi.github.io, http://localhost:5500'
      },
    });
    const offersData = await offersResponse.json();
    console.log("Offer Data:", offersData); // Add this line to log the response data

    offers = offersData.data;

    if (offers.length === 0) {
      console.log("No flights found.");
      return;
    }

    // Sort the offers by total_amount
    offers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));

    // Display the top 5 cheapest offers
    const numberOfOffers = Math.min(offers.length, 5);
    // ...
    offers.sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount));
    displayOffers(offers.slice(0, numberOfOffers));



  } catch (error) {
    console.error("Error fetching flight data:", error);
    document.getElementById("cheapest-flight").textContent = "Error fetching flight data";
  }
}


async function createOrder(offerId, passengerDetails) {
  // Step 3: Create Order
  const createOrderUrl = `https://api.duffel.com/air/orders`;
  const requestBody = {
    "data": {
      "offer_id": offerId,
      "passengers": [passengerDetails],
      "fulfillment": {
        "type": "ticket",
        "pickup": {
          "location": "Lufthansa check-in desk",
          "date_time": "2023-05-30T06:20:00Z"
        }
      }
    }
  };

  try {
    const createOrderResponse = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Duffel-Version': 'beta',
        'Authorization': `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': 'https://calsoufi.github.io, http://localhost:5500'
      },
      body: JSON.stringify(requestBody),
    });
    const createOrderData = await createOrderResponse.json();
    console.log("Order Data:", createOrderData); // Add this line to log the response data

    const order = createOrderData.data;

    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    document.getElementById("cheapest-flight").textContent = "Error creating order";
  }
}
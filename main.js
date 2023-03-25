// main.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getDatabase, ref, push, remove} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js";
import { onValue, query } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-database.js';
window.togglePanel = togglePanel;


     // Your web app's Firebase configuration
     const firebaseConfig = {
        apiKey: "AIzaSyD9p4iFYGtOGmHqPnuzb7kxNgrrNGJ4boo",
        authDomain: "calsoufiplaces.firebaseapp.com",
        databaseURL: "https://calsoufiplaces-default-rtdb.europe-west1.firebasedatabase.app/", // Add your Realtime Database URL here
        projectId: "calsoufiplaces",
        storageBucket: "calsoufiplaces.appspot.com",
        messagingSenderId: "804743678576",
        appId: "1:804743678576:web:0af44414e9180c952582b5"
    };


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
const db = getDatabase(app);

// Add the form event listener
document.getElementById("updateForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Retrieve the input values
    const city = document.getElementById("city").value;
    const startdate = document.getElementById("startdate").value;
    const description = document.getElementById("description").value;
    const amenities = document.getElementById("amenities").value;
    const reviews = document.getElementById("reviews").value;
    const star_rating = document.getElementById("star_rating").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    // Create a new object with the input values
    const newPlace = {
          city: city,
          startdate: startdate,
          description: description,
          amenities: amenities,
          reviews: reviews,
          star_rating: star_rating,
          latitude: latitude,
          longitude: longitude
        // Add more fields as needed
    };

    // Save the new place data to Realtime Database
    push(ref(db, "places/"), newPlace)
        .then(function () {
            console.log("Data saved successfully.");
            alert("New location data submitted!");
                // Fetch data from the Realtime Database
        fetchData();
        })
        .catch(function (error) {
            console.error("Error saving data: ", error);
            alert("Failed to submit location data.");
        });
});


window.fetchData = function() {
    const placesRef = ref(db, 'places/');
    const placesQuery = query(placesRef);
  
    onValue(placesQuery, (snapshot) => {
      const data = snapshot.val();
      console.log('Data fetched from Firebase:', data);
      const placesArray = [];
  
      for (const key in data) {
        placesArray.push({
          key: key,
          ...data[key]
        });
      }
  
      fetchAndDisplayData(placesArray);
    }, (error) => {
      console.error('Error fetching data from Firebase:', error);
    });
  };

function fetchAndDisplayData(places) {
    GetMap(places);
  }
  
  function togglePanel() {
    var panel = document.querySelector(".hover-panel");
    var isOpen = panel.style.transform === "scale(1)";
  
    if (isOpen) {
      panel.style.transform = "scale(0)";
    } else {
      panel.style.transform = "scale(1)";
    }
  }

  window.deleteLocation = function (key) {
    if (confirm("Are you sure you want to delete this location?")) {
      const locationRef = ref(db, `places/${key}`);
      remove(locationRef)
        .then(() => {
          console.log("Location deleted successfully.");
          alert("Location deleted successfully!");
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting location: ", error);
          alert("Failed to delete location.");
        });
    }
}

  
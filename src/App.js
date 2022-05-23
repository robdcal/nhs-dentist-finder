import "./App.css";
import { useEffect, useState } from "react";
import { PostcodeInput } from "./components/PostcodeInput";

function App() {
  const [postcode, setPostcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dentists, setDentists] = useState([]);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setPostcode(event.target.value);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      getDentists();
      setActive(true);
    } catch (error) {
      setError("Please enter a valid URL.");
      setActive(false);
    }
  };

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLng(position.coords.longitude);
      setLat(position.coords.latitude);
    });
  };

  useEffect(() => {
    if (lat) {
      fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`)
        .then((response) => response.json())
        .then((data) => {
          setPostcode(data.result[0].postcode);
        });
    }
  }, [lat, lng]);

  const getDentists = () => {
    fetch(
      `http://localhost:8888/.netlify/functions/scrape-dentists?` +
        new URLSearchParams({
          postcode: postcode,
          lat: lat,
          lng: lng,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        setDentists(data.dentistsList);
      });
  };

  const availableDentists = dentists.filter(
    (dentist) => dentist.availability === "Yes"
  );

  const dentistsList = availableDentists.map((dentist, index) => (
    <li key={index}>{dentist.name}</li>
  ));

  const headerStyling = {
    minHeight: active ? "40vh" : "100vh",
    margin: active ? "4rem 0" : "0",
  };

  return (
    <div className="App">
      <header className="hero" style={headerStyling}>
        <h1>NHS Dentist Finder</h1>
        <p>
          Either manually enter your postcode or use Geolocation to
          automatically fill it.
        </p>
        <PostcodeInput
          inputValue={postcode}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          error={error}
          getGeolocation={getGeolocation}
        />
        <ul>{dentistsList}</ul>
      </header>
    </div>
  );
}

export default App;

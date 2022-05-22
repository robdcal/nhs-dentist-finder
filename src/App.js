import "./App.css";
import { useState } from "react";
import { PostcodeInput } from "./components/PostcodeInput";

function App() {
  const [postcode, setPostcode] = useState("");
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setPostcode(event.target.value);
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // try {
    //   const url = new URL(Url);
    //   dispatchDeconstructor(url);
    //   setActive(true);
    // } catch (error) {
    //   setError("Please enter a valid URL.");
    //   setActive(false);
    // }
  };

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(
        `https://api.postcodes.io/postcodes?lon=${position.coords.longitude}&lat=${position.coords.latitude}`
      )
        .then((response) => response.json())
        .then((data) => {
          setPostcode(data.result[0].postcode);
        });
    });
  };

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
      </header>
    </div>
  );
}

export default App;

import "./App.css";
import { useEffect, useState } from "react";
import { PostcodeInput } from "./components/PostcodeInput";
import { DentistsList } from "./components/DentistsList";

function App() {
  const [postcode, setPostcode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dentists, setDentists] = useState([]);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setError("");
    setLat("");
    setLng("");
    setPostcode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      getDentists();
      setActive(true);
    } catch (error) {
      setError("Please enter a valid postcode.");
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
    if (lat && lng) {
      fetch(`https://api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(
              "There was an issue converting your geolocation to a postcode. Please try again."
            );
          }
          return response.json();
        })
        .then((data) => {
          if (!data.result) {
            throw new Error(
              "Geolocation not valid or recognised. Try again or manually enter a UK postcode."
            );
          }
          setPostcode(data.result[0].postcode);
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
  }, [lat, lng]);

  useEffect(() => {
    if (postcode) {
      const debounce = setTimeout(() => {
        fetch(`https://api.postcodes.io/postcodes/${postcode}/validate`)
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(
                "There was an issue validating your postcode. Please try again."
              );
            }
            return response.json();
          })
          .then((data) => {
            if (!data.result) {
              throw new Error(
                "Postcode not valid or recognised. Please enter a valid UK postcode."
              );
            }
            return fetch(`https://api.postcodes.io/postcodes/${postcode}`);
          })
          .then((response) => {
            if (response.status !== 200) {
              throw new Error(
                "There was an issue retreiving geolocation data from your postcode. Please try again."
              );
            }
            return response.json();
          })
          .then((data) => {
            if (!data.result) {
              throw new Error(
                "There was an unexpected error when trying to get geolocation data from your postcode. Please try again."
              );
            }
            setLat(data.result.latitude);
            setLng(data.result.longitude);
          })
          .catch((error) => {
            console.error(error);
            setError(error.message);
          });
      }, 1500);
      return () => {
        clearTimeout(debounce);
      };
    }
  }, [postcode]);

  const getDentists = () => {
    fetch(
      `/.netlify/functions/scrape-dentists?` +
        new URLSearchParams({
          postcode: postcode,
          lat: lat,
          lng: lng,
        })
    )
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(
            "There was an issue gathering the data from the NHS website. Please try again."
          );
        }
        return response.json();
      })
      .then((data) => {
        if (!data) {
          throw new Error(
            "No data was returned from the NHS website, possibly due to an error. Please try again later."
          );
        }
        setDentists(data.dentistsList);
      })
      .catch((error) => {
        console.error(error);
        setError(error.message);
      });
  };

  const availableDentists = dentists.filter(
    (dentist) => dentist.availability === "Yes"
  );

  const headerStyling = {
    minHeight: active ? "40vh" : "100vh",
    margin: active ? "4rem 0" : "0",
  };

  return (
    <div className="App">
      <header className="hero" style={headerStyling}>
        <h1>NHS Dentist Finder</h1>
        <p>
          This tool checks the availability of your nearest dental practices
          taking on new patients using data from the NHS.
        </p>
        <PostcodeInput
          inputValue={postcode}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          error={error}
          getGeolocation={getGeolocation}
        />
        {active && availableDentists.length === 0 && (
          <p className="loading">Checking nearest 50 dentists...</p>
        )}
        <DentistsList
          dentists={dentists}
          availableDentists={availableDentists}
        />
      </header>
    </div>
  );
}

export default App;

import { useState, Fragment } from "react";

export const DentistsList = ({
  dentists,
  availableDentists,
  more,
  searching,
  searchMore,
}) => {
  const [showUnavailable, setShowUnavailable] = useState(false);

  const unavailableDentists = dentists.filter(
    (dentist) => dentist.availability !== "Yes"
  );

  const toggleUnavailable = (event) => {
    event.preventDefault();
    setShowUnavailable(!showUnavailable);
  };

  return (
    <Fragment>
      {availableDentists.length > 0 && (
        <Fragment>
          <h3>
            Out of the {dentists.length} nearest dentists to you,
            {availableDentists.length} are accepting new adult NHS patients.
          </h3>
          <br />
          <h4>Available Dentists</h4>
          <table>
            <thead>
              <tr>
                <td>Dentist Name</td>
                <td>Distance</td>
                <td>Address</td>
                <td>Tel</td>
              </tr>
            </thead>
            <tbody>
              {availableDentists.map((dentist, index) => (
                <tr key={index}>
                  <td>
                    <a href={dentist.link}>{dentist.name}</a>
                  </td>
                  <td>{dentist.distance}</td>
                  <td>{dentist.address}</td>
                  <td>
                    <a href={`tel:${dentist.tel}`}>{dentist.tel}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {more && (
            <button onClick={searchMore} disabled={searching}>
              {searching ? "Searching..." : "Search for more"}
            </button>
          )}
          <button onClick={toggleUnavailable}>
            {showUnavailable ? "Hide unavailable" : "Show unavailable"}
          </button>
          {showUnavailable && (
            <Fragment>
              <br />
              <h4>Unavailable Dentists</h4>
              <table>
                <thead>
                  <tr>
                    <td>Dentist Name</td>
                    <td>Distance</td>
                    <td>Address</td>
                    <td>Tel</td>
                  </tr>
                </thead>
                <tbody>
                  {unavailableDentists.map((dentist, index) => (
                    <tr key={index}>
                      <td>
                        <a href={dentist.link}>{dentist.name}</a>
                      </td>
                      <td>{dentist.distance}</td>
                      <td>{dentist.address}</td>
                      <td>
                        <a href={`tel:${dentist.tel}`}>{dentist.tel}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

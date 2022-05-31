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
    <div
      className={`list-container${
        dentists.length > 0 ? " list-container-active" : ""
      }`}
    >
      {availableDentists.length > 0 && (
        <Fragment>
          <h4 className="available">Available Dentists</h4>
          <h3 className="msg-count">
            Out of the <strong>{dentists.length}</strong> nearest dentists to
            you, <strong>{availableDentists.length}</strong> are accepting new
            adult NHS patients.
          </h3>
          <div className="dentists">
            {availableDentists.map((dentist, index) => (
              <div className="dentist" key={index}>
                <h4 className="dentist-name">{dentist.name}</h4>
                <a className="dentist-profile" href={dentist.link}>
                  View NHS Profile
                </a>
                <p className="dentist-distance">{dentist.distance}</p>
                <p className="dentist-address">{dentist.address}</p>
                <a className="dentist-tel" href={`tel:${dentist.tel}`}>
                  {dentist.tel}
                </a>
              </div>
            ))}
          </div>
          {more && (
            <button
              className="btn btn-more"
              onClick={searchMore}
              disabled={searching}
            >
              {searching ? "Searching..." : "Search for more"}
            </button>
          )}
          <button className="btn btn-unavailable" onClick={toggleUnavailable}>
            {showUnavailable ? "Hide unavailable" : "Show unavailable"}
          </button>
          {showUnavailable && (
            <Fragment>
              <h4 className="unavailable">Unavailable Dentists</h4>
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
    </div>
  );
};

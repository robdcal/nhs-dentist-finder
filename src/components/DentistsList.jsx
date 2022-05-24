import { Fragment } from "react";

export const DentistsList = ({ dentists, availableDentists }) => {
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
              </tr>
            </thead>
            <tbody>
              {availableDentists.map((dentist, index) => (
                <tr key={index}>
                  <td>{dentist.name}</td>
                  <td>{dentist.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Fragment>
      )}
    </Fragment>
  );
};

import { Fragment } from "react";

export const DentistsList = ({ availableDentists }) => {
  return (
    <Fragment>
      {availableDentists.length > 0 && (
        <Fragment>
          <h3>Available Dentists</h3>
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

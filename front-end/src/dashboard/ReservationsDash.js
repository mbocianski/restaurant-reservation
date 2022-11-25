import React from "react";
import { formatAsTime } from "../utils/date-time";
import { Link } from "react-router-dom";
import CancelReservation from "../reservations/CancelReservation";

export default function ReservationsDash({ reservations, loadDashboard }) {
  //formats reservations as lines with data
  const displayReservations = reservations.map(
    ({
      reservation_time,
      reservation_id,
      mobile_number,
      first_name,
      last_name,
      people,
      status,
    }) => {
      // capitalizes first letter of status
      const resStatus = status.charAt(0).toUpperCase() + status.slice(1);

      //local function for buttons
      function ReservationButtons() {
        return (
          <div className="d-flex flex-row justify-content-around">
            {status === "booked" ? (
              <>
              <div>
                <Link to={`reservations/${reservation_id}/seat`}>
                  <button className="btn btn-primary">Seat</button>
                </Link>
              </div>
                <div>
                <Link to={`reservations/${reservation_id}/edit`}>
                  <button className="btn btn-secondary">Edit</button>
                </Link>
              </div>
              </>
            ) : null}
           
            {status === "booked" ? (
              <div>
                 <CancelReservation reservation_id={reservation_id} loadDashboard={loadDashboard} />
              </div>
            ) : null}
          </div>
        );
      }




      return (
        <li
          className="list-group-item d-flex justify-content-between align-items-center"
          key={reservation_id}
        >
          <div>
            <p>
              <strong>{`${formatAsTime(reservation_time)}`}</strong>
            </p>
            <p>
              {`${first_name} ${last_name} `}
              <em>{`(Party of ${people})`}</em>{" "}
            </p>
            <p>{`Mobile: ${mobile_number}`}</p>
            <ReservationButtons />
          </div>

          <span
            className="badge badge-primary badge-pill p-2"
            data-reservation-id-status={reservation_id}
          >
            {resStatus}
          </span>
        </li>
      );
    }
  );

  return (
    <div className="my-3">
      {reservations.length < 1 ? (
        <h3>No Reservations Today</h3>
      ) : (
        <ul>{displayReservations}</ul>
      )}
    </div>
  );
}

import React from "react";
import { formatAsTime } from "../utils/date-time";
import { Link } from "react-router-dom";


export default function ReservationsDash({reservations}) {



  //formats reservations as lines with data
  const displayReservations = reservations.map(
    ({
      reservation_date,
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
            {status === "booked" ? 
            <Link to={`reservations/${reservation_id}/seat`}>
              <button className="btn btn-primary">Seat</button>
            </Link> : null }
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

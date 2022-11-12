import React from "react";
import { formatAsTime } from "../utils/date-time";

export default function ReservationsDash({reservations}){

//formats reservations as lines with data

    const displayReservations = reservations.map(
        ({
          reservation_time,
          reservation_id,
          mobile_number,
          first_name,
          last_name,
          people,
        }) => {
          return (
            <li className="list-group-item" key={reservation_id}>
              <p>
                <strong>{`${formatAsTime(reservation_time)}`}</strong>
              </p>
              <p>
                {`${first_name} ${last_name} `}
                <em>{`(Party of ${people}) `}</em>
              </p>
              <p>
                {`Mobile: ${mobile_number}`}
              </p>
            </li>
          );
        }
      );

      return (
        <div className="my-3">
        {reservations.length < 1 ? (<h3>No Reservations Today</h3>) : (<ul>{displayReservations}</ul>)}
        </div>
      )


}
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

      //set badge color

      let badgeColor;
      switch (status) {
        case "booked":
          badgeColor = "badge-light";
          break;
        case "seated":
          badgeColor = "badge-primary";
          break;
        case "finished":
          badgeColor = "badge-success";
          break;
        case "cancelled":
          badgeColor = "badge-danger";
          break;
        default:
          badgeColor = "badge-light";
      }

      //local function for buttons
      function ReservationButtons() {
        return (
          <div className="d-flex flex-row">
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
            ) : (
              <div></div>
            )}

            {status === "booked" ? (
              <div>
                <CancelReservation
                  reservation_id={reservation_id}
                  loadDashboard={loadDashboard}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        );
      }

      return (
        <li className="card text-white bg-dark mb-5 px-2" key={reservation_id}>
          <div className="card-body container ">
            <div className="card-text row pr-4">
              <div className="col-9 col-md-10">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">
                    <h4>
                      <strong>{`${formatAsTime(reservation_time)}`}</strong>
                    </h4>
                  </div>
                  <div className="col-12 col-md-4 my-auto">
                    <h5>{`${first_name} ${last_name}`}</h5>
                    <p>
                      <em>{`( Party of ${people} )`}</em>
                    </p>

                    <p>{`Mobile: ${mobile_number}`}</p>
                  </div>

                  <div className="col-12 col-md-4 my-auto">
                    <ReservationButtons />
                  </div>
                </div>
              </div>
              <div className="col-3 col-md-2 my-auto">
                <span
                  className={`badge ${badgeColor} badge-pill p-3`}
                  data-reservation-id-status={reservation_id}
                >
                  {resStatus}
                </span>
              </div>
            </div>
          </div>
        </li>
      );
    }
  );

  return (
    
    <div className="my-3">
      {reservations.length < 1 ? (
        <div className="card text-white bg-danger text-center no-res">
          <h3 className="card-body my-0">No Reservations Today</h3>
        </div>
      ) : (
        <ul>{displayReservations}</ul>
      )}
    </div>
  
  );
}

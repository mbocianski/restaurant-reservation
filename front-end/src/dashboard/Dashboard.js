import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import {useLocation, Link} from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { formatAsTime } from "../utils/date-time";




/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {

  // pulls in the date query from the URL to pass to List API function
  
  const query = useQuery();
  const {search} = useLocation();

  let date;
  (search) ? date = query.get("date") : date = today();
  const previousDate = previous(date)
  const nextDate = next(date)



  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
const displayReservations = reservations.map((
  {reservation_time, 
  reservation_id, 
  reservation_date,
  first_name,
  last_name,
  people})=>{
  
  return (
   <li className="list-group-item" key={reservation_id}>
  <p><strong>{`${formatAsTime(reservation_time)}`}</strong></p>
  <p>{`${first_name} ${last_name} `}<em>{`(Party of ${people}) `}</em></p>
   </li>
  )
})

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ul>{displayReservations}</ul>
      <div>
        <Link to={`/dashboard?date=${previousDate}`}>
          <button className="btn mx-1 btn-secondary">Previous Day</button>
        </Link>
        <Link to="dashboard">
          <button className="btn mx-1 btn-primary">Today</button>
        </Link>
        <Link to={`/dashboard?date=${nextDate}`}>
          <button className="btn mx-1 btn-secondary">Next Day</button>
        </Link>
      </div>
    </main>
  );
}

export default Dashboard;

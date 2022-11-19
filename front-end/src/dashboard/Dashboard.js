import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDash from "./ReservationsDash";
import TablesDash from "./TablesDash";
import { useLocation, Link } from "react-router-dom";
import { today, previous, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { listTables } from "../utils/api";
import Loading from "./Loading";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  // pulls in the date query from the URL to pass to List API function

  const query = useQuery();
  const { search } = useLocation();

  let date;
  search ? (date = query.get("date")) : (date = today());
  const previousDate = previous(date);
  const nextDate = next(date);

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [loaded, setLoaded] = useState(false);



  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

//separate function to tables to pass as props to avoid unecessary reload of reservations

  useEffect(loadTables, [date])
  function loadTables(){
    setLoaded(false);
    const abortController = new AbortController();
    listTables(abortController.signal)
    .then(setTables)
    .then(setLoaded(true))
    .then(console.log("done"))
    .catch(setReservationsError)
    

    return () => abortController.abort();
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{`Reservations for ${date}`}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {loaded ? 
      <div className="container">
        <div className="row">
          <div className="col-6 border border-solid">
           <ReservationsDash reservations={reservations} />
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
          <div className="col-6 border border-solid">
         <TablesDash tables={tables} loadTables={loadTables}/>
          </div>
        </div>
      </div> : <Loading /> }
    </main>
  );
}

export default Dashboard;

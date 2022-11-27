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

  useEffect(loadTables, [date]);
  function loadTables() {
    setLoaded(false);
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .then(setLoaded(true))
      .then(console.log("done"))
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  return (
    <main>
      <div className="container-fluid mx-3">
        <div className="row mb-5">
          <div className="col-md-12 text-center">
            <h2 className=" py-5">Dashboard</h2>
              <h3>
                <em>{`Reservations for ${date}`}</em>
              </h3>
          </div>
        </div>
        <ErrorAlert error={reservationsError} />
        {loaded ? (
          <div>
          <div className="row pb-5">
            <div className="col-md-12 d-flex flex-row justify-content-around justify-content-md-start">
            <Link to={`/dashboard?date=${previousDate}`}>
                <button className="btn btn-secondary">Previous Day</button>
              </Link>
              <Link to="dashboard">
                <button className="btn btn-primary ">Today</button>
              </Link>
              <Link to={`/dashboard?date=${nextDate}`}>
                <button className="btn btn-secondary">Next Day</button>
              </Link>
          </div>
          </div>
           <div className="row"> 
          <div className="col-md-12 border border-solid">
              <ReservationsDash
                reservations={reservations}
                loadDashboard={loadDashboard}
              />
            </div>
            </div>
           <div className="row">
            <div className="col-md-12 border border-solid">
              <TablesDash
                tables={tables}
                loadTables={loadTables}
                loadDashboard={loadDashboard}
              />
              </div>
            </div>
            </div>
        ) : (
          <Loading />
        )}
      </div>
    </main>
  );
}

export default Dashboard;

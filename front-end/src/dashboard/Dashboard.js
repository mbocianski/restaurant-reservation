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
  const [loaded, setLoaded] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [date]);

  //loads reservations, sets erros, and load state
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((data) => {
        setReservations(data);
        setLoaded(true);
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  //separate function to tables to pass as props to avoid unecessary reload of reservations

  useEffect(loadTables, [date]);
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  return (
    <main>
      {loaded ? (
        <div className="container-fluid px-3 mt-5">
          <div className="row my-4">
            <div className="col text-center ">
              <h2>Dashboard</h2>
            </div>
          </div>
          <div>
            <div className="row my-2">
              <div className="col">
                <ErrorAlert error={reservationsError} />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-lg-8">
                <div className="row my-3">
                  <div className="col text-center">
                    <Link to={`/dashboard?date=${previousDate}`}>
                      <button className="btn btn-secondary">
                        Previous Day
                      </button>
                    </Link>
                    <Link to="dashboard">
                      <button className="btn btn-primary">Today</button>
                    </Link>
                    <Link to={`/dashboard?date=${nextDate}`}>
                      <button className="btn btn-secondary">Next Day</button>
                    </Link>
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col text-center ">
                    <h3>
                      <em>{`Reservations for ${date}`}</em>
                    </h3>
                  </div>
                </div>

                <div className="row my-2">
                  <div className="col-md-12 ">
                    <ReservationsDash
                      reservations={reservations}
                      loadDashboard={loadDashboard}
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-4 mt-lg-5 pt-lg-4">
                <div className="row slight-buffer">
                  <div className="col text-center">
                    <h3>
                      <em>Tables</em>
                    </h3>
                  </div>
                </div>
                <div className="row my-3">
                  <div className="col-md-12">
                    <TablesDash
                      tables={tables}
                      loadTables={loadTables}
                      loadDashboard={loadDashboard}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Loading spinner
        <Loading />
      )}
    </main>
  );
}

export default Dashboard;

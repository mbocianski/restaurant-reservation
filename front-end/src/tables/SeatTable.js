import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import { CheckSeatErrors } from "./CheckTableErrors";
import MapErrors from "../utils/MapErrors";

export default function SeatTable() {
  const [allTables, setAllTables] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [seatErrors, setSeatErrors] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [table, setTable] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  //loads table and resrervation data
  useEffect(loadData, [reservation_id]);

  function loadData() {
    const abortController = new AbortController();
    setSeatErrors(null);

    listTables(abortController.signal).then(setAllTables).catch(setSeatErrors);

    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setSeatErrors);

    return () => abortController.abort();
  }

  // sets table to table selected from form
  const changeHandler = ({ target }) => {
    const selectedTable = allTables.find(
      (table) => Number(target.value) === table.table_id
    );
    setTable(selectedTable);
  };

  // sets default of people to 0 if reservaiton is not loaded
  let people = reservation ? reservation.people : 0;
  //sets errors on form change and pases table information and party size
  useEffect(() => {
    setShowErrors(false);
    setSeatErrors(null);
    setSeatErrors(CheckSeatErrors(table, people));
  }, [table, people]);

  // Adds a reservation ID to the respective "tables" table and updaetes reservation to "seated"
  //Uses Put since function is used by delete in unseatTable
  async function seatTable(table_id, reservation_id) {
    try {
      await updateTable(table_id, Number(reservation_id), "PUT");
      setTable(null);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  // submit form, prevent reload and seat table.
  const submitHandler = (event) => {
    event.preventDefault();
    if (seatErrors) setShowErrors(true);
    if (table) {
      seatTable(table.table_id, reservation_id);
    }
  };

  // maps table data to create options for the form.
  const formOptions = allTables.map((table) => {
    return (
      <option
        key={table.table_id}
        value={table.table_id}
      >{`${table.table_name} - ${table.capacity}`}</option>
    );
  });

  return (
    <div className="contianer mt-5">
      <div className="form-row">
        <div className="col-12 text-center">
          <h2 className="multiline">{`Select a table for
          reservation # ${reservation_id}`}</h2>
          <form onSubmit={submitHandler}>
            <div className="my-3">
              <label htmlFor="table_id">
                <select
                  className="form-control"
                  onChange={changeHandler}
                  name="table_id"
                >
                  <option value={null}>Select a Table</option>
                  {formOptions}
                </select>
              </label>
            </div>
            <button
              type="button"
              onClick={() => history.goBack()}
              className="btn btn-secondary mx-auto"
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" value="submit">
              Submit
            </button>
          </form>
          {/* maps errors into ShowErrors */}
          {showErrors && <MapErrors errors={seatErrors} />}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import {CheckSeatErrors} from "./CheckTableErrors";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatTable() {

  const [allTables, setAllTables] = useState([]);
  const [reservation, setReservation] = useState(null);
  const [seatErrors, setSeatErrors] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [table, setTable] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();


  //loads table and resrervation data
  useEffect(loadData, []);

  function loadData() {
    const abortController = new AbortController();
    setSeatErrors(null);

    listTables(abortController.signal).then(setAllTables).catch(setSeatErrors);

    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setSeatErrors);

    return () => abortController.abort();
  }
  console.log("res", reservation)

// sets table to table selected from form
  const changeHandler = ({target}) => {
    const selectedTable = allTables.find(table => Number(target.value) === table.table_id)
    setTable(selectedTable);
  
  }

//sets errors on form change and pases table information and party size
useEffect(() => {
    setShowErrors(false);
    setSeatErrors(null);
    if(table) setSeatErrors(CheckSeatErrors(table, reservation.people));
  }, [table]);

  let errors;
  
  if (seatErrors) {
    errors = seatErrors.map((error, index) => {
      const formattedError = { message: error };
      return (
        <div key={index}>
          <ErrorAlert error={formattedError} />
        </div>
      );
    });
  }



  const submitHandler = (event) => {
      event.preventDefault();
      if(errors) setShowErrors(true);
  }


  // maps table data to create options for the form.
  const formOptions =  allTables.map((table) => {
      return(
   <option key={table.table_id} value={table.table_id}>{`${table.table_name} - ${table.capacity}`}</option>
      )     
  });


  return (
    <div>
      <h2>{`Select a table to seat reservation # ${reservation_id} at`}</h2>
        <form onSubmit={submitHandler}>
            <div className="my-3">
            <label htmlFor="table_id">
              <select className="form-control" onChange={changeHandler} name="table_id">
                <option value={null}>Select a Table</option>
                {formOptions}
              </select>
            </label>
            </div>
            <button type="button" onClick={() => history.goBack()} className="btn btn-secondary">
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" value="submit">
          Submit
        </button>
        </form>
         {/* maps errors into ShowErrors */}
       {showErrors && errors}
      </div>
  );
}

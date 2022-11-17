import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import {CheckSeatErrors} from "./CheckTableErrors";
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

// sets table to table selected from form
  const changeHandler = ({target}) => {
    const selectedTable = allTables.find(table => Number(target.value) === table.table_id)
    setTable(selectedTable);
  }

// sets default of people to 0 if reservaiton is not loaded
let people;
reservation ? people = reservation.people : people = 0
//sets errors on form change and pases table information and party size
useEffect(() => {
    setShowErrors(false);
    setSeatErrors(null);
    setSeatErrors(CheckSeatErrors(table, people));
  }, [table]);



async function update(table_id, reservation_id){

 console.log(table_id, reservation_id)   
    try {
        await updateTable(table_id, Number(reservation_id));
        setTable(null);
        history.push("/dashboard");
      } catch (error) {
        console.log("api error: ", error.message)
      }
    }
  



  const submitHandler = (event) => {
      event.preventDefault();
      if(seatErrors) setShowErrors(true);
      if (table) update(table.table_id, reservation_id)
  }

console.log(table, "table");
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
       {showErrors && <MapErrors errors={seatErrors} />}
      </div>
  );
}

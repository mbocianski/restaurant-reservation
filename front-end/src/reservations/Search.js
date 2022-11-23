import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import {useHistory } from "react-router-dom"
import ReservationsDash from "../dashboard/ReservationsDash";

export default function Search() {

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

// updates the url with the query
useEffect(()=>{
  history.push(`/search?mobile_number=${query}`)
}, [query,history])

  const changeHandler = ({ target }) => {
    setQuery(target.value);
  };

  async function searchNumber() {
    const abortController = new AbortController();
    const { signal } = abortController;
    try {
      const data = await listReservations({"mobile_number": query }, signal);
      setSearchResults(data);
      setSubmitted(true);
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  const submitHandler = (event) => {
    setSubmitted(false);
    event.preventDefault();
    console.log("searching....");
    searchNumber();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h2>Search for a Reservation</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label" htmlFor="mobile_number"></label>
              <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                placeholder="Enter a customer's phone number"
                type="tel"
                value={query}
                onChange={changeHandler}
              />
            </div>
            <button className="btn btn-primary" type="submit" value="submit">
              Find
            </button>
          </form>
        </div>
      {/* Displays only after form is submitted and will show results or none found   */}
      </div>
      {submitted ? (
        searchResults.length > 0 ? (
          <div className="row">
            <div className="col-6 border border-solid">
              <ReservationsDash reservations={searchResults} />
            </div>
          </div>
        ) : (
          <h2>No reservations found</h2>
        )
      ) : null}
    </div>
  );
}

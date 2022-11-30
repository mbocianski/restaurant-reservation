import React, { useState, useEffect } from "react";
import { listReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import ReservationsDash from "../dashboard/ReservationsDash";

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

  // updates the url with the query
  useEffect(() => {
    history.push(`/search?mobile_number=${query}`);
  }, [query, history]);

  const changeHandler = ({ target }) => {
    setQuery(target.value);
  };

  //makes API call to searach for numbers
  async function searchNumber() {
    const abortController = new AbortController();
    const { signal } = abortController;
    try {
      const data = await listReservations({ mobile_number: query }, signal);
      setSearchResults(data);
      setSubmitted(true);
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  const submitHandler = (event) => {
    setSubmitted(false);
    event.preventDefault();
    searchNumber();
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-lg-4">
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
            <button
              className="btn btn-primary mx-auto"
              type="submit"
              value="submit"
            >
              Find
            </button>
          </form>
        </div>
        {/* Displays only after form is submitted and will show results or none found   */}
        {submitted ? (
          searchResults.length > 0 ? (
            <div className="col-12 slight-buffer col-lg-8">
              <ReservationsDash reservations={searchResults} />
            </div>
          ) : (
            <div className="text-center col-12 slight-buffer col-lg-8">
              <h2 className="bg-dark py-5 my-5">No reservations found</h2>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}

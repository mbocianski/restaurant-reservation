import React, { useEffect, useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  const changeHandler = ({ target }) => {
    setQuery(target.value);
  };
  console.log("query", query);

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          <h2>Search for a Reservation</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label" htmlFor="search">
              </label>
              <input
                className="form-control"
                id="search"
                name="search"
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
      </div>
    </div>
  );
}

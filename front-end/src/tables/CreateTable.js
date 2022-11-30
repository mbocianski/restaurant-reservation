import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import { CheckTableErrors } from "./CheckTableErrors";
import MapErrors from "../utils/MapErrors";

export default function CreateTable() {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };

  const history = useHistory();

  const [formData, setFormData] = useState(initialFormData);
  const [showErrors, setShowErrors] = useState(false);
  const [tableErrors, setTableErrors] = useState(null);

  //sets state for changes and sets capacity to an integer
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "capacity" ? parseInt(target.value) : target.value,
    });
  };

  //sets errors on form change
  useEffect(() => {
    setShowErrors(false);
    setTableErrors(null);
    setTableErrors(CheckTableErrors(formData));
  }, [formData]);

  //sends data to Table API to create new table
  async function newTable(formData) {
    try {
      await createTable(formData);
      setFormData(initialFormData);
      history.push("/dashboard");
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  //Displays any table errors and attempts to create a new table
  const submitHandler = (event) => {
    event.preventDefault();
    if (tableErrors) setShowErrors(true);
    newTable(formData);
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-lg-6">
          <h2>Create Table</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <label className="form-label" htmlFor="table_name">
                Table Name:
              </label>
              <input
                className="form-control"
                id="table_name"
                name="table_name"
                type="text"
                value={formData.table_name}
                onChange={changeHandler}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="capacity">
                Capacity:
              </label>
              <input
                className="form-control"
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={changeHandler}
              />
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
          {showErrors && <MapErrors errors={tableErrors} />}
        </div>
      </div>
    </div>
  );
}

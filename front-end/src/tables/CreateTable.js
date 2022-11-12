import React, {useState} from "react";
import {useHistory} from "react-router-dom"
import { createTable } from "../utils/api";

export default function CreateTable() {

  const initialFormData = {
    name: "",
    capacity: "",
  };

  const {history} = useHistory();

  const [formData, setFormData] = useState({initialFormData});
  console.log("form:", formData)

  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "capacity" ? parseInt(target.value) : target.value,
    });
  };

  async function newTable(formData) {
    try {
      await createTable(formData);
      setFormData(initialFormData);
      history.push("/dashboard");
    } catch (error) {
      console.log("api error: ", error.message)
    }
  }


  const submitHandler = (event) => {
      event.preventDefault();
      newTable(formData);
  }

  return (
    <div>
      <h2>Create Table</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Name:
          </label>
          <input
            className="form-control"
            id="name"
            name="name"
            type="text"
            minLength={2}
            value={formData.name}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="capacity">
            Capacity:
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              defaultValue={1}
              value={formData.capacity}
              onChange={changeHandler}
            />
          </label>
        </div>
        <button onClick={() => history.goBack()} className="btn btn-secondary">
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" value="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

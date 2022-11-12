import React, { useEffect, useState } from "react";
import { today, next } from "../utils/date-time";
import {useHistory} from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { dayOfWeek } from "../utils/date-time";
import CheckFormErrors from "./CheckFormErrors";


function ReservationForm({ type }) {
  const history = useHistory();
  let initialFormData;

  //sets reservation date for tomorrow, or two days out of tommorrow is a Tuesday
  const firstDate = () => {
    if (dayOfWeek(next(today())) === "Tuesday") {
      return next(next(today()));
    }
    return next(today());
  };

  if (type === "new") {
    initialFormData = {
      first_name: "",
      last_name: "",
      mobile_number: "",
      reservation_date: firstDate(),
      reservation_time: "",
      people: 0,
    };
  }

  const [formData, setFormData] = useState(initialFormData);
  const [reservationsError, setReservationsError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  //updates form as user types
  const changeHandler = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]:
        target.name === "people" ? parseInt(target.value) : target.value,
    });
  };

  //sets errors every time the data on the form changes
  useEffect(() => {
    setShowErrors(false);
    setReservationsError(null);
    setReservationsError(CheckFormErrors(formData));
  }, [formData]);

  //maps each error into ErrorAlert componenet;
  let errors;
  if (reservationsError) {
    errors = reservationsError.map((error, index) => {
      const formattedError = { message: error };
      return (
        <div key={index}>
          <ErrorAlert error={formattedError} />
        </div>
      );
    });
  }


  //send data to createReservation API function;

  async function newReservation(formData) {
    try {
      await createReservation(formData);
      const toDate = formData.reservation_date;
      setFormData(initialFormData);
      history.push(`/dashboard?date=${toDate}`);
    } catch (error) {
      console.log("api error: ", error.message)
    }
  }

  const submitHandler = (event) => {
    if (reservationsError)setShowErrors(true)
    event.preventDefault();
    newReservation(formData);
  }

  return (
    <div>
      <h2>New Reservation</h2>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label className="form-label" htmlFor="first_name">
            First Name:
          </label>
          <input
            className="form-control"
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="last_name">
            Last Name:
          </label>
          <input
            className="form-control"
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="mobile_number">
            Mobile Number:
          </label>
          <input
            className="form-control"
            id="mobile_number"
            name="mobile_number"
            type="tel"
            placeholder="XXX-XXX-XXXX"
            value={formData.mobile_number}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="people">
            Number of People:
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              placeholder="Party Size"
              value={formData.people}
              onChange={changeHandler}
            />
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_date">
            Date of Reservation:
          </label>
          <input
            className="form-control"
            id="reservation_date"
            name="reservation_date"
            type="date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            value={formData.reservation_date}
            onChange={changeHandler}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="reservation_time">
            Time of Reservation:
          </label>
          <input
            className="form-control"
            id="reservation_time"
            name="reservation_time"
            type="time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            value={formData.reservation_time}
            onChange={changeHandler}
          />
        </div>
        <button onClick={() => history.goBack()} className="btn btn-secondary">
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

export default ReservationForm;

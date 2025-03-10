import React, { useEffect, useState } from "react";
import { today, next } from "../utils/date-time";
import { useHistory, useParams } from "react-router-dom";
import {
  createReservation,
  readReservation,
  updateReservation,
} from "../utils/api";
import MapErrors from "../utils/MapErrors";
import { dayOfWeek } from "../utils/date-time";
import CheckFormErrors from "./CheckFormErrors";

function ReservationForm({ type }) {
  const history = useHistory();
  let initialFormData;
  const { reservation_id } = useParams();

  //sets reservation date for tomorrow, or two days out of tommorrow is a Tuesday
  const firstDate = () => {
    if (dayOfWeek(next(today())) === "Tuesday") {
      return next(next(today()));
    }
    return next(today());
  };

  initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: firstDate(),
    reservation_time: "",
    people: 0,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [reservationsError, setReservationsError] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  function formatPhone(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  //loads table and resrervation data if editing a table
  useEffect(() => {
    // will load in existing reservation if type = edit
    async function loadData() {
      const abortController = new AbortController();
      setReservationsError(null);

      const data = await readReservation(
        reservation_id,
        abortController.signal
      );

      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        mobile_number: data.mobile_number,
        reservation_date: data.reservation_date,
        reservation_time: data.reservation_time,
        people: data.people,
        status: data.status,
      });
      return () => abortController.abort();
    }

    if (type === "edit") loadData();
  }, [reservation_id, type]);

  //updates form as user types
  const changeHandler = ({ target }) => {
    //formats phone number
    if (target.name === "mobile_number") {
      const phone = formatPhone(target.value);
      setFormData({
        ...formData,
        [target.name]: phone,
      });
    } else {
      setFormData({
        ...formData,
        [target.name]:
          target.name === "people" ? parseInt(target.value) : target.value,
      });
    }
  };

  //sets errors every time the data on the form changes
  useEffect(() => {
    setShowErrors(false);
    setReservationsError(null);
    setReservationsError(CheckFormErrors(formData));
  }, [formData]);

  //send data to createReservation or updateReservation API function;

  async function sendReservation(formData) {
    try {
      type === "edit"
        ? await updateReservation(formData, reservation_id)
        : await createReservation(formData);

      const toDate = formData.reservation_date;
      history.push(`/dashboard?date=${toDate}`);
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  const submitHandler = (event) => {
    if (reservationsError) setShowErrors(true);
    event.preventDefault();
    sendReservation(formData);
  };

  return (
    <div className="m-5">
      <h2>
        {type === "edit"
          ? `Editing Reservation # ${reservation_id}`
          : "New Reservation"}
      </h2>
      <p><em>Times are in PST</em></p>
      {/* maps errors into ShowErrors */}
      {showErrors && <MapErrors errors={reservationsError} />}
      <form onSubmit={submitHandler}>
        <div className="form-row">
          <div className="mb-3 col-12 col-md-6">
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
          <div className="mb-3 col-12 col-md-6">
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
          <div className="mb-3 col-12 col-sm-6 col-md-4">
            <label className="form-label" htmlFor="mobile_number">
              Mobile Number:
            </label>
            <input
              onChange={changeHandler}
              value={formData.mobile_number}
              id="mobile_number"
              name="mobile_number"
              className="form-control"
              placeholder="Enter Phone Number"
            />
          </div>
          <div className="mb-3 col-12 col-sm-6 col-md-4">
            <label className="form-label" htmlFor="people">
              Number of People:
            </label>
            <input
              className="form-control"
              id="people"
              name="people"
              type="number"
              placeholder="Party Size"
              value={formData.people}
              onChange={changeHandler}
            />
          </div>
          <div className="mb-3 col-12 col-sm-6 col-md-4">
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
          <div className="mb-3 col-12 col-sm-6 col-md-4">
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
    </div>
  );
}

export default ReservationForm;

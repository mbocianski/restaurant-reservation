import { dayOfWeek } from "../utils/date-time";
const moment = require("moment");

//Pushes thrown errors to array to be mapped throught ErrorAlert file

export default function checkFormErrors(formData) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
  } = formData;

  const requestedMoment =
    formData.reservation_date + " " + formData.reservation_time;
  let errors = [];

  if (
    !first_name ||
    !last_name ||
    !mobile_number ||
    !reservation_date ||
    !reservation_time
  ) {
    errors.push("All fields are required");
    return errors;
  }

  if (dayOfWeek(formData.reservation_date) === "Tuesday") {
    errors.push(
      "Sorry, we are closed on Tuesdays. Please select another date."
    );
  }
  if (moment(requestedMoment).isBefore(moment())) {
    errors.push("Reservations must be in the future!");
  }

  if (formData.people < 1) {
    errors.push("Must have at least 1 person in your party");
  }
 

  // Error handling for resrvation time
  const format = "hh:mm";
  const reservation = moment(formData.reservation_time, format);
  const openTime = moment("10:30", format);
  const lastCall = moment("21:30", format);
  const closeTime = moment("22:30", format);

  if (reservation.isBefore(openTime)) {
    errors.push("Reservations cannot be made before 10:30 AM.");
  }

  if (reservation.isBetween(lastCall, closeTime)) {
    errors.push(
      "Reservations cannot be made after 9:30 PM. Kitchen is closed."
    );
  }

  if (reservation.isAfter(closeTime)) {
    errors.push("Sorry, we are closed at that time.");
  }

  return errors;
}

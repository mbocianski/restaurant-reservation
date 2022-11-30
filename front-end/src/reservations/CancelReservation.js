import React from "react";
import { setReservationStatus } from "../utils/api";

//cancels a reservation with a confirm window

export default function CancelReservation({ reservation_id, loadDashboard }) {
  async function cancel() {
    try {
      await setReservationStatus(Number(reservation_id), "PUT");
      loadDashboard();
    } catch (error) {
      console.log("api error: ", error.message);
    }
  }

  const clickHandler = () => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      ) === true
    ) {
      cancel();
    }
  };

  return (
    <button
      data-reservation-id-cancel={reservation_id}
      onClick={clickHandler}
      className="btn btn-danger"
    >
      Cancel
    </button>
  );
}

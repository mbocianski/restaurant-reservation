import React from "react"
import ErrorAlert from "../layout/ErrorAlert";

export default function MapErrors({errors}){

  if (errors) {
    let displayError
    return errors.map((error, index) => {
      displayError = { message: error };
      return (
        <div key={index}>
          <ErrorAlert error={displayError} />
        </div>
      );
    });
  }

}
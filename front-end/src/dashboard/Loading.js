import React from "react";


//loading spinner while api makes calls
export default function Loading() {
  return (
    <div
      style={{ overflowY: "hidden", marginTop: "10%" }}
      className="container"
    >
      <div className="row">
        <div className="col d-flex align-items-center flex-column justify-content-center text-center">
          <div className="loader my-4"></div>
          <div>
            <h2>Loading...</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

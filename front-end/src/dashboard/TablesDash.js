import React from "react";
import FreeTable from "../tables/FreeTable";

export default function TablesDash({ tables, loadTables, loadDashboard}) {
  const displayTables = tables.map((table) => {
    return (
      <li
        className="card text-white bg-dark mb-5 px-2"
        key={table.table_id}
      >
        <div className="card-body">
        <div className="row mx-xl-4 mx-md-4">
        <div className="col-6 my-auto">
          <h4>
            <strong>{table.table_name}</strong>
          </h4>
          <p>
            <em>{`${table.capacity} seats`}</em>
          </p>
        </div>
        <div className="my-auto text-right col-6" style={{ fontSize: "20px" }}>
          <strong>
            <p data-table-id-status={`${table.table_id}`}>
              {table.reservation_id ? "Occupied" : "Free"}
            </p>
          </strong>
          {table.reservation_id ? (
            <FreeTable
              table_id={table.table_id}
              reservation_id={table.reservation_id}
              loadTables={loadTables}
              loadDashboard={loadDashboard}
            />
          ) : null}
        </div>
        </div>
        </div> 
      </li>
    );
  });

  return (
    <div className="my-3">
      {tables.length < 1 ? <h3>No Tables Exist</h3> : <ul>{displayTables}</ul>}
    </div>
  );
}

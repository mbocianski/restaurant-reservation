import React from "react";
import FreeTable from "../tables/FreeTable";

export default function TablesDash({ tables, loadTables}) {
  const displayTables = tables.map((table) => {
    return (
      <li
        className="list-group-item d-flex justify-content-around"
        key={table.table_id}
      >
        <div>
          <p>
            <strong>{table.table_name}</strong>
          </p>
          <p>
            <em>{`${table.capacity} seats`}</em>
          </p>
        </div>
        <div className="my-auto" style={{ fontSize: "20px" }}>
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
            />
          ) : null}
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

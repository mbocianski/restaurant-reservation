import React from "react";

export default function TablesDash({tables}){

    const displayTables = tables.map((table) => {

          return (
            <li className="list-group-item d-flex justify-content-around" key={table.table_id}>
            <div>
              <p>
                <strong>{table.table_name}</strong>
              </p>
              <p>
                <em>{`${table.capacity} seats`}</em>
              </p>
              </div>
              <div className="my-auto" style={{fontSize:"20px"}}>
               <strong><p data-table-id-status={`${table.table_id}`}>{table.reservation_id ? "Occupied": "Free"}</p></strong>
              </div>
            </li>
          );
        }
      );

      return (
        <div className="my-3">
        {tables.length < 1 ? (<h3>No Tables Exist</h3>) : (<ul>{displayTables}</ul>)}
        </div>
      )


}
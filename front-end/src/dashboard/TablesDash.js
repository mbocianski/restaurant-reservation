import React from "react";

export default function TablesDash({tables}){

    const displayTables = tables.map(
        ({table_id, table_name, capacity}) => {
          return (
            <li className="list-group-item" key={table_id}>
              <p>
                <strong>{table_name}</strong>
              </p>
              <p>
                <em>{`${capacity} seats`}</em>
              </p>
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
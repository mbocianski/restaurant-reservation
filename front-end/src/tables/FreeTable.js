import React from "react";
import { updateTable } from "../utils/api";

export default function FreeTable({table_id, reservation_id, loadTables, loadDashboard}){

async function freeTable(){
        try {
          await updateTable(table_id, Number(reservation_id), "DELETE");
          loadTables();
          loadDashboard();
          
        } catch (error) {
          console.log("api error: ", error.message);
        }
}


  const clickHandler = () => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      ) === true
    ) {
        freeTable();

    }
    }

return (
    <button
            data-table-id-finish={`${table_id}`}
            className="btn btn-danger"
            onClick={clickHandler}
          >
            Finish
          </button> 
)
    
}
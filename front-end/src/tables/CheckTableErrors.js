function CheckTableErrors(table) {
  const { table_name, capacity } = table;
  let errors = [];

  if (table_name.length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (capacity < 1) {
    errors.push("Capacity must be at least 1");
  }

  return errors;
}

function CheckSeatErrors(table = null, people = null) {
    let errors = [];
  if (!table) {
    errors.push("Please select a table!");
  } else {
    const { table_name, capacity, reservation_id } = table;
  

    if (reservation_id) errors.push(`${table_name} is full!`);
    if (people > capacity) errors.push(`Plase select a larger table`);
  }
  return errors;
}

module.exports = {
  CheckTableErrors,
  CheckSeatErrors,
};

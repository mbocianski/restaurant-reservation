export default function checkTableErrors(table){

    const {table_name, capacity} = table;
    let errors = [];

    if (table_name.length < 2){
        errors.push("Name must be at least 2 characters")
    }

    if (capacity < 1){
        errors.push("Capacity must be at least 1");
    }

    return errors;

}
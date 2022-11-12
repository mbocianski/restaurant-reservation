const knex = require("../db/connection");


async function list(date){
        return knex("reservations")
        .select("*")
        .where("reservation_date", date)
        .orderBy("reservation_time", "asc")
    
   
       
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((reservation)=> reservation[0])
    
}

module.exports = {
    list,
    create
}
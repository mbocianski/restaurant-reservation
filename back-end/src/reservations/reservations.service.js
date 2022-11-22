const knex = require("../db/connection");


async function list(date){
        return knex("reservations")
        .select("*")
        .whereNot("status", "finished")
        .andWhere("reservation_date", date)
        .orderBy("reservation_time", "asc")
    
   
       
}

async function create(reservation){
    return knex("reservations")
        .insert(reservation)
        .returning("*")
        .then((reservation)=> reservation[0])
    
}

async function read(reservation_id){
    return knex("reservations")
    .select("*")
    .where("reservation_id", reservation_id)
    .first();
}

async function setStatus(reservation_id, status){

    return knex("reservations")
        .update({status: status})
        .where("reservation_id", reservation_id)
        .returning("*")
        .then((row)=> row[0]);
}

module.exports = {
    list,
    create,
    read,
    setStatus
}
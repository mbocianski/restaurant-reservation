const { returning } = require("../db/connection");
const knex = require("../db/connection");


async function list(date){
        return knex("reservations")
        .select("*")
        .whereNot("status", "finished")
        .andWhere("reservation_date", date)
        .orderBy("reservation_time", "asc")       
}

async function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
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

async function updateReservation(reservation_id, reservation){
    const {
        first_name, 
        last_name, 
        mobile_number, 
        people,
        reservation_date,
        reservation_time
    } = reservation

    return knex("reservations")
        .update({first_name})
        .update({last_name}) 
        .update({mobile_number})
        .update({people}) 
        .update({reservation_date})
        .update({reservation_time})
        .where({reservation_id})
        .returning("*")
        .then((row)=> row[0]);
}

module.exports = {
    list,
    create,
    read,
    setStatus,
    search,
    updateReservation
}
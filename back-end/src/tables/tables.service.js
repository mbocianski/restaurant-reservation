const { KnexTimeoutError } = require("knex");
const knex = require("../db/connection");

async function list() {
  return knex("tables").select("*").orderBy("table_name", "asc");
}

async function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((table) => table[0]);
}


async function getTable(table_id) {
  return knex("tables")
    .select("*")
    .where("table_id", table_id)
    .then((row) => row[0]);
}

async function allIds() {
  return knex("reservations").select("reservation_id");
}

async function seatTable(table_id, reservation_id){

  return  knex.transaction(function(trx){
    console.log("zz", table_id, reservation_id)
    return knex("tables")
     .update( "reservation_id", reservation_id )
     .where("table_id", table_id)
     .transacting(trx)
     .then(function(){
       return knex("reservations")
               .update("status", "seated")
               .where({reservation_id})
               .transacting(trx)
       })
     .then(trx.commit)
     .catch(trx.rollback)
 
    })
    .catch(function(error){
      console.error(error);
    })
 }



async function unseatTable(table_id, reservation_id){

 return  knex.transaction(function(trx){

   return knex("tables")
    .update( "reservation_id", null )
    .where("table_id", table_id)
    .transacting(trx)
    .then(function(){
      return knex("reservations")
              .update("status", "finished")
              .where({reservation_id})
              .transacting(trx)
      })
    .then(trx.commit)
    .catch(trx.rollback)

   })
   .catch(function(error){
     console.error(error);
   })
}

module.exports = {
  list,
  create,
  getTable,
  allIds,
  seatTable,
  unseatTable

};

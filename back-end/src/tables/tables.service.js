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

async function update(table_id, reservation_id) {
  return knex("tables")
    .update({ reservation_id: reservation_id })
    .where("table_id", table_id)
    .returning("*")
    .then((row) => row[0]);
}

async function getTable(table_id) {
  return knex("tables")
    .select("capacity", "reservation_id")
    .where("table_id", table_id)
    .then((row) => row[0]);
}

async function allIds() {
  return knex("reservations").select("reservation_id");
}

async function reservationExists(reservation_id) {
  return knex("reservations")
    .select("reservation_id", "people")
    .where("reservation_id", reservation_id)
    .then((row) => (row[0] ? row[0] : 0));
}

module.exports = {
  list,
  create,
  update,
  getTable,
  reservationExists,
  allIds,
};

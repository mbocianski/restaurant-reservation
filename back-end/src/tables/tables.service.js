const knex = require("../db/connection");

async function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name", "asc")
}

async function create(table){
    return knex("tables")
        .insert(table)
        .returning("*")
        .then((table)=> table[0])
}

module.exports = {
    list,
    create,
}
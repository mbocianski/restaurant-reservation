const knex = require("../db/connection");

async function list(){
    return knex("tables")
    .select("*")
    .orderBy("name", "asc")
}


module.exports = {
    list,
}
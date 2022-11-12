const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


async function list(req, res, next){
    res.json({ data: await service.list() });
}


async function create(req,res,next){

}


module.exports = {
    list: asyncErrorBoundary(list),
    create: asyncErrorBoundary(create),
}
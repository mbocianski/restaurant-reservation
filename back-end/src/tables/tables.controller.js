const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");



async function list(req, res, next){
    res.json({ data: await service.list() });
}

//Checks if request contains data
function hasData(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "Body must contain data",
    });
  }
  next();
}

//Checks for each property in form

function hasProperty(property) {
    return function (req, res, next) {
      if (!req.body.data[property]) {
        next({
          status: 400,
          message: `Table must include ${property}`,
        });
      }
      res.locals = req.body.data;
      next();
    };
  }

//checks if name has at least 2 characters
function checkName(req, res, next){
    const {table_name} = res.locals
    if(table_name.length < 2){
        next({
            status: 400,
            message: "table_name must be at least two characters"
        })
    }
    next();
}

//checks if capacity is an integer and at least one
function checkCapacity(req,res,next){
    const {capacity} = res.locals;
    if(typeof capacity !== "number" || capacity < 1 ){
        next({
            status: 400,
            message: "capacity must be a number greater than 0"
        });
    };
        next();
}


async function create(req, res){
    const table = res.locals;
    res.status(201).json({data: await service.create(table)})
}


module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        hasData,
        hasProperty("table_name"),
        hasProperty("capacity"),
        checkName,
        checkCapacity,
        asyncErrorBoundary(create),
    ]
}
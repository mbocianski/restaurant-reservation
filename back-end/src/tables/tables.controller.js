const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
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
function checkName(req, res, next) {
  const { table_name } = res.locals;
  if (table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be at least two characters",
    });
  }
  next();
}

//checks if capacity is an integer and at least one
function checkCapacity(req, res, next) {
  const { capacity } = res.locals;
  if (typeof capacity !== "number" || capacity < 1) {
    next({
      status: 400,
      message: "capacity must be a number greater than 0",
    });
  }
  next();
}

async function create(req, res) {
  const table = res.locals;
  res.status(201).json({ data: await service.create(table) });
}

function hasReservation(req, res, next) {
  if (!req.body.data.reservation_id) {
    next({
      status: 400,
      message: "Request must include reservation_id",
    });
  }
  next();
}

function hasOnlyReservationData(req, res, next) {
  if (Object.keys(req.body.data).length > 1) {
    next({
      status: 400,
      message: "Request must only include reservation_id",
    });
  }

  next();
}

function reservationIdIsNumber(req, res, next) {
  if (typeof req.body.data.reservation_id !== "number") {
    next({
      status: 400,
      message: "reservation_id must be a number",
    });
  }

  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await service.reservationExists(reservation_id);
  if (!reservation.reservation_id) {
    next({
      status: 404,
      message: `reservation ${reservation_id} does not exist!`,
    });
  }
  res.locals = reservation;
  next();
}

async function checkTableCapacity(req, res, next) {
  const { table_id } = req.params;
  const { people } = res.locals;
  const table = await service.getTable(table_id);
  if (people > table.capacity) {
    next({
      status: 400,
      message: "people exceeds table capacity",
    });
  }
  res.locals = table;
  next();
}

function tableIsOccupied(req, res, next) {
  if (res.locals.reservation_id !== null) {
    next({
      status: 400,
      message: "Table is occupied. Please select another table.",
    });
  }
  next();
}

//updates table with reservation_id when table is seated
async function update(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  res
    .status(200)
    .json({ data: await service.update(table_id, reservation_id) });
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
  ],
  update: [
    hasData,
    hasReservation,
    hasOnlyReservationData,
    reservationIdIsNumber,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(checkTableCapacity),
    tableIsOccupied,
    asyncErrorBoundary(update),
  ],
};

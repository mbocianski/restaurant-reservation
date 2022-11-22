const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reservationService = require("../reservations/reservations.service")

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
  } else {
    next();
  }
}

//Checks for each property in form

function hasProperty(property) {
  return function (req, res, next) {
    if (!req.body.data[property]) {
      next({
        status: 400,
        message: `Table must include ${property}`,
      });
    } else {
      res.locals = req.body.data;
      next();
    }
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
  } else {
    next();
  }
}

//checks if capacity is an integer and at least one
function checkCapacity(req, res, next) {
  const { capacity } = res.locals;
  if (typeof capacity !== "number" || capacity < 1) {
    next({
      status: 400,
      message: "capacity must be a number greater than 0",
    });
  } else {
    next();
  }
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
  } else {
    next();
  }
}

function hasOnlyReservationData(req, res, next) {
  if (Object.keys(req.body.data).length > 1) {
    next({
      status: 400,
      message: "Request must only include reservation_id",
    });
  } else {
    next();
  }
}

function reservationIdIsNumber(req, res, next) {
  if (typeof req.body.data.reservation_id !== "number") {
    next({
      status: 400,
      message: "reservation_id must be a number",
    });
  } else {
    next();
  }
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  if (reservation) {
    res.locals = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `reservation ${reservation_id} does not exist!`,
    });
   
  }
}

async function isReservationSeated(req, res, next){
  const { reservation_id } = req.body.data;
  const reservation = await reservationService.read(reservation_id);
  const {status} = reservation
  if (status === "seated"){
    next({
      status: 400,
      message: `reservation ${reservation_id} is already seated!`
    })
  }else{
    next();
  }
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
  } else {
    next();
  }
}

async function tableIsOccupied(req, res, next) {
  const { table_id } = req.params;
  const table = await service.getTable(table_id);
  if (table.reservation_id) {
    next({
      status: 400,
      message: "Table is occupied. Please select another table.",
    });
  } else {
    next();
  }
}



//updates table with reservation_id when table is seated
async function seatTable(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  const newReservation = await service.seatTable(
    Number(table_id),
    reservation_id
  );
  res.status(200).json({ data: newReservation });
}

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.getTable(table_id);
  if (!table) {
    next({
      status: 404,
      message: `table_id ${table_id} does not exist`,
    });
  } else {
    res.locals = table;
    next();
  }
}

async function tableIsNotOccupied(req, res, next) {
  const table = await service.getTable(res.locals.table_id);
  if (!table.reservation_id) {
    next({
      status: 400,
      message: "Table is not occupied. Please select another table.",
    });
  } else {
    next();
  }
}

async function unseatTable(req, res) {
  const { table_id, reservation_id } = res.locals;
  console.log("table", table_id, reservation_id)
  const newReservation = await service.unseatTable(Number(table_id), Number(reservation_id));
  console.log("news", newReservation);
  res.status(200).json({});
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
    asyncErrorBoundary(isReservationSeated),
    asyncErrorBoundary(checkTableCapacity),
    asyncErrorBoundary(tableIsOccupied),
    asyncErrorBoundary(seatTable),
  ],
  destroy: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsNotOccupied),
    asyncErrorBoundary(unseatTable),
  ],
};

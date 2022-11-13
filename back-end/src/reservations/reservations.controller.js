const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moment = require("moment");
const tableService = require("../tables/tables.service");
// const { next } = require("../../../front-end/src/utils/date-time");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
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
        message: `Reservation must include ${property}`,
      });
    }
    res.locals = req.body.data;
    next();
  };
}

//checks to see if date and time exist
function checkDate(req, res, next) {
  const { reservation_date, reservation_time } = res.locals;
  const dayName = moment(reservation_date).format("dddd");

  //reconstitues date and time for comparison to currnt monent
  const requestedMoment = reservation_date + " " + reservation_time;
  if (!moment(reservation_date, "YYYY-MM-DD", true).isValid()) {
    next({
      status: 400,
      message: "reservation_date must be a date!",
    });
  }
  if (dayName == "Tuesday") {
    next({
      status: 400,
      message: "Sorry, we are closed on Tuesdays, please select another date",
    });
  }
  if (moment(requestedMoment).isBefore(moment())) {
    next({
      status: 400,
      message: "Reservation must be in the future",
    });
  }

  next();
}

//formats time with moment and checks for several time validations
function checkTime(req, res, next) {
  const { reservation_time } = res.locals;
  const format = "hh:mm";
  const reservation = moment(reservation_time, format);
  const openTime = moment("10:30", format);
  const lastCall = moment("21:30", format);
  const closeTime = moment("22:30", format);

  if (!reservation.isValid()) {
    next({
      status: 400,
      message: "reservation_time must be a time!",
    });
  }

  if (reservation.isBefore(openTime)) {
    next({
      status: 400,
      message: "Reservations are not allowed before 10:30 a.m.",
    });
  }

  if (reservation.isBetween(lastCall, closeTime)) {
    next({
      status: 400,
      message: "Reservations cannot be made after 9:30 PM. Kitchen is closed.",
    });
  }

  if (reservation.isAfter(closeTime)) {
    next({
      status: 400,
      message: "We are closed at this time.",
    });
  }

  next();
}

function peopleIsInteger(req, res, next) {
  const { people } = res.locals;
  if (typeof people !== "number" || people < 1) {
    next({
      status: 400,
      message: "people must be a number and greater than 0",
    });
  }
  next();
}

async function create(req, res) {
  const reservation = res.locals;
  res.status(201).json({ data: await service.create(reservation) });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await tableService.reservationExists(reservation_id);
  if (!reservation.reservation_id) {
    next({
      status: 404,
      message: `reservation ${reservation_id} does not exist!`,
    });
  }
  res.locals = reservation_id;
  next();
}

async function read(req, res, next) {
  res.json({ data: await service.read(res.locals) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasProperty("first_name"),
    hasProperty("last_name"),
    hasProperty("mobile_number"),
    hasProperty("reservation_date"),
    hasProperty("reservation_time"),
    hasProperty("people"),
    peopleIsInteger,
    checkDate,
    checkTime,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
};

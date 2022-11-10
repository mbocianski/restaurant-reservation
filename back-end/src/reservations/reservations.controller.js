const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moment = require("moment");
const { default: ReservationForm } = require("../../../front-end/src/reservations/reservationForm");
// const { next } = require("../../../front-end/src/utils/date-time");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

function hasData(req, res, next) {
  if (!req.body.data) {
    next({
      status: 400,
      message: "Body must contain data",
    });
  }
  next();
}

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

function checkDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
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

function checkTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const format = "hh:mm";
  const reservation = moment(formData.reservation_time, format);
  const openTime = moment("10:30", format);
  const lastCall = moment("21:30", format)
  const closeTime = moment("22:30", format);

  if (!reservation.isValid()) {
    next({
      status: 400,
      message: "reservation_time must be a time!",
    });
  }

  if(reservation.isBefore(openTime)){
    next({
      statis: 400,
      message: "reservation_time must be after 9:30 a.m."
    })
  }

  if(reservation.isBetween(lastCall,closeTime)){
    next({
      statis: 400,
      message: "reservation_time cannot be after 9:30 p.m."
    })
  }

  if(reservation.isAfter(closeTime)){
    next({
      statis: 400,
      message: "reservation_time is not valid after 10:30 p.m."
    })
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
  const reservation = req.body.data;
  res.status(201).json({ data: await service.create(reservation) });
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
};

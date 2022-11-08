const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const moment = require("moment")
// const { next } = require("../../../front-end/src/utils/date-time");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const {date} = req.query
  res.json({data: await service.list(date)});
}


  function hasData(req,res,next){
    if (!req.body.data){
      next({
        status: 400,
        message: "Body must contain data"
      })
    }
    next();
  }

  function hasProperty(property){
    return function (req, res, next){
    if (!req.body.data[property]){
    next({
      status: 400,
      message: `Reservation must include ${property}`
    })
  }
    res.locals = req.body.data
    next();
  }
  }

  function checkDate(req,res,next){
    const {reservation_date, reservation_time} = req.body.data 
    const dayName = moment(reservation_date).format('dddd');

    //reconstitues date and time for comparison to currnt monent
    const requestedMoment = reservation_date + " " + reservation_time;


    if (!moment(reservation_date, "YYYY-MM-DD", true).isValid()){
    next({
      status: 400,
      message: "reservation_date must be a date!"
    })
    }
    if(dayName == 'Tuesday'){
      next({
        status: 400,
        message: "Sorry, we are closed on Tuesdays, please select another date"
      })
    }
    if (moment(requestedMoment).isBefore(moment())){
      next({
        status: 400,
        message: "Reservation must be in the future"
      })
    }
    
    next();
  }

  function checkTime(req,res,next){
    const {reservation_time} = req.body.data;
    if (!moment(reservation_time, "HH:mm", true).isValid()){
    next({
      status: 400,
      message: "reservation_time must be a time!"
    })
    }
    next();
  }


  function peopleIsInteger(req, res, next){
    const {people} = res.locals;
    if (typeof(people) !== "number" || people < 1){
      next({
        status: 400,
        message: "people must be a number and greater than 0"
      })
    }
    next();
  }
  



async function create(req, res){
  const reservation = req.body.data;
 res.status(201).json({data: await service.create(reservation)})
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
  asyncErrorBoundary(create)
]
};

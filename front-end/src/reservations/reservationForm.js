import React, { useEffect, useState } from "react";
import { today, next } from "../utils/date-time";
import {Link, useHistory, useParams} from "react-router-dom";
import {createReservation} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert"
import { dayOfWeek } from "../utils/date-time";
import CheckFormErrors from "./CheckFormErrors";
const moment = require("moment");

function ReservationForm({type}){

const history = useHistory();
let initialFormData;


//sets reservation date for tomorrow, or two days out of tommorrow is a Tuesday
const firstDate = () => {
 if (dayOfWeek(next(today())) === "Tuesday"){ 
     return next(next(today()))}
     return next(today());
}

if (type === "new"){
    initialFormData = {
        "first_name": "",
        "last_name": "",
        "mobile_number": "",
        "reservation_date": firstDate(),
        "reservation_time": "",
        "people": 0
    }
}

const [formData, setFormData] = useState(initialFormData);
const [reservationsError, setReservationsError] = useState(null);

//updates form as user types
const changeHandler = ({target}) =>{

    setFormData({
        ...formData,
        [target.name]: (target.name === "people") ? parseInt(target.value) : target.value
})
}

// console.log("form:", formData)

useEffect(()=>{
    async function check(){
const errors = await CheckFormErrors(formData);
if (errors.length > 0){
    setReservationsError({message: errors.join("\r\n")})
} else {
    setReservationsError(null);
}
    }
    check();
},[formData])

//send data to createReservation API function;

async function newReservation(formData){  
setReservationsError(null);  
const errors = await CheckFormErrors(formData);

console.log("errors:" , errors)
if (!errors.length > 0){
     try{
        await createReservation(formData)
        const toDate = formData.reservation_date;
        setFormData(initialFormData);
        history.push(`/dashboard?date=${toDate}`)
    }
     catch (error) {
        setReservationsError(error);
        
    }
    } else {
        setReservationsError({message: errors.join("\r\n")})
        }

}

const submitHandler = (event) => {
    event.preventDefault();
   newReservation(formData);
    }



    return(
        <div>
           
            <h2>New Reservation</h2>
            <form onSubmit={submitHandler}>
            <div className="mb-3">
                <label className="form-label" htmlFor="first_name">
                    First Name:
                </label>
                    <input 

                        className="form-control"
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={changeHandler}
                        required={true}/>
                </div>
                <div className="mb-3">
                <label className="form-label" htmlFor="last_name">
                    Last Name:
                </label>
                    <input 
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={changeHandler}
                        required={true}/>
                </div>
                <div className="mb-3">
                <label className="form-label" htmlFor="mobile_number">
                    Mobile Number:
                </label>
                    <input 
                        className="form-control"
                        id="mobile_number"
                        name="mobile_number"
                        type="tel"
                        placeholder="XXX-XXX-XXXX"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        value={formData.mobile_number}
                        onChange={changeHandler}
                        required={true}/>
                </div>
                <div className="mb-3">
                <label className="form-label" htmlFor="people">
                    Number of People:
                    <input 
                        className="form-control"
                        id="people"
                        name="people"
                        type="number"
                        placeholder="Party Size"
                        value={formData.people}
                        onChange={changeHandler}
                        required={true}/>
                </label>
                    
                </div>
                <div className="mb-3">
                 <label className="form-label" htmlFor="reservation_date">
                    Date of Reservation:
                </label>
                    <input 
                        className="form-control"
                        id="reservation_date"
                        name="reservation_date"
                        type="date" 
                        placeholder="YYYY-MM-DD" 
                        pattern="\d{4}-\d{2}-\d{2}"
                        value={formData.reservation_date}
                        onChange={changeHandler}
                        required={true}/>
                        </div>
                <div className="mb-3">
                <label className="form-label" htmlFor="reservation_time">
                    Time of Reservation:
                </label>
                    <input 
                        className="form-control"
                        id="reservation_time"
                        name="reservation_time"
                        type="time" 
                        placeholder="HH:MM" 
                        pattern="[0-9]{2}:[0-9]{2}"
                        value={formData.reservation_time}
                        onChange={changeHandler}
                        required={true}/>
                </div>
                <button onClick={() => history.goBack()} className="btn btn-secondary">Cancel</button>
                 <button className="btn btn-primary" type="submit" value="submit">Submit</button>
            </form>
            {reservationsError && <ErrorAlert error={reservationsError} />}  
        </div>
    );
}

export default ReservationForm;
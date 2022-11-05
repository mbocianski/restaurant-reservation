import React, { useEffect, useState } from "react";
import { today } from "../utils/date-time";
import {Link, useHistory, useParams} from "react-router-dom";
import {createReservation} from "../utils/api";
import {ErrorAlert} from "../layout/ErrorAlert"

function ReservationForm({type}){

const history = useHistory();
let initialFormData;

if (type === "new"){
    initialFormData = {
        "first_name": "",
        "last_name": "",
        "mobile_number": "",
        "reservation_date": today(),
        "reservation_time": "",
        "people": 0
    }
}


const [formData, setFormData] = useState(initialFormData);

//updates form as user types
const changeHandler = ({target}) =>{
    console.log("target", target.name)
    setFormData({
        ...formData,
        [target.name]: (target.name === "people") ? parseInt(target.value) : target.value
})

}

//send data to createReservation API function;
async function newReservation(formData){    
    try{
    await createReservation(formData)
    } catch (error) {
        console.log("error: ", error)
    }
}


const submitHandler = (event) => {
    event.preventDefault();
    console.log("submitted")
    if (type === "new") newReservation(formData);
    const toDate = formData.reservation_date;
    setFormData(initialFormData);
    history.push(`/dashboard?date=${toDate}`)

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
                <input className="btn btn-primary" type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default ReservationForm;
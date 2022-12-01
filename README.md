# Periodic Tables - Restaurant Reservation System

<img src="./front-end/src/images/pt_dashboard.png" width="500" alt="dashboard">

<br>

## [View Application](https://restaurant-reservation-client-27ki.onrender.com/)

<br>

## About Periodic Tables

Periodic Tables is a restaurant reservation system to manage reservations and seat guests at tables. 
This responsive app can be used across desktop, tablet, and mobile devices.

<br>

### Main features:

- Take reservations for current and future dates
<br><br>
<img src="./front-end/src/images/pt_new-reservation.png" width="500" alt="create reservation form">
<br><br>
- Edit or cancel existing reservations that have not been seated
<br><br>
<img src="./front-end/src/images/pt_sec.png" width="500" alt="seat edit and cancel buttons on reservation">
<br><br>
- Create and seat tables
<br><br>
<img src="./front-end/src/images/pt_create-table.png" width="250" alt="create table form">
<img src="./front-end/src/images/pt_seat.png" width="250" alt="seat table form">
<br><br>
- Search for reservations by phone number
<br><br>
<img src="./front-end/src/images/pt_search.png" width="500" alt="search by mobile number form">
<br><br>
- Free tables when guests leave
<br><br>
<img src="./front-end/src/images/pt_table.png" width="250" alt="occupied table with seat button">
<br><br>


### Other Features

- Loading spinner while data loads
<br><br>
<img src="./front-end/src/images/pt_loading.png" width="250" alt="Loading">
<br><br>
- No alert when no reservations exist for that day
<br><br>
<img src="./front-end/src/images/pt_no-reservations.png" width="250" alt="No Reservations Today">
<br><br>
- Informative errors on forms to prevent user and database errors
<br><br>
<img src="./front-end/src/images/pt_new-reservation-error.png" width="250" alt="No Reservations Today">
<img src="./front-end/src/images/pt_seat-error.png" width="250" alt="No Reservations Today">
<br><br>


## API Endpoints

Server URL: https://restaurant-reservation-backend-xynu.onrender.com

| Endpoint                    | Methods             | Description                                                                      |
| ----------------------------|---------------------|----------------------------------------------------------------------------------|
| `/reservations`             | <img src="./front-end/src/images/api/get-yes.png" alt="green get" height="20"> <img src="./front-end/src/images/api/post-yes.png" alt="green post" height="20">  <img src="./front-end/src/images/api/put-no.png" alt="red put" height="20"> <img src="./front-end/src/images/api/delete-no.png" alt="red delete" height="20">| List and create reservations                           |
| `/reservations/:reservation_id`             | <img src="./front-end/src/images/api/get-yes.png" alt="green get" height="20"> <img src="./front-end/src/images/api/post-no.png" alt="red post" height="20">  <img src="./front-end/src/images/api/put-yes.png" alt="green put" height="20"> <img src="./front-end/src/images/api/delete-no.png" alt="red delete" height="20">| Retrieve and edit reservations by ID
| `/reservations/:reservation_id/status`             | <img src="./front-end/src/images/api/get-no.png" alt="red get" height="20"> <img src="./front-end/src/images/api/post-no.png" alt="red post" height="20">  <img src="./front-end/src/images/api/put-yes.png" alt="green put" height="20"> <img src="./front-end/src/images/api/delete-no.png" alt="red delete" height="20">| Update the status of a specific reservation (Booked / Seated / Cancelled / Finished)
| `/tables`             | <img src="./front-end/src/images/api/get-yes.png" alt="green get" height="20"> <img src="./front-end/src/images/api/post-yes.png" alt="green post" height="20">  <img src="./front-end/src/images/api/put-no.png" alt="red put" height="20"> <img src="./front-end/src/images/api/delete-no.png" alt="red delete" height="20">| List and create tables
| `/tables/:table_id/seat`             | <img src="./front-end/src/images/api/get-no.png" alt="red get" height="20"> <img src="./front-end/src/images/api/post-no.png" alt="red post" height="20">  <img src="./front-end/src/images/api/put-yes.png" alt="green put" height="20"> <img src="./front-end/src/images/api/delete-yes.png" alt="green delete" height="20">| Seat and unseat tables. Uses knex transaction to sync with Reservations table |

<br>

## Technology

### Frontend
- Html
- CSS (Bootstrap)
- Javascript (ES6)
- React

### Backend
- Node.js
- Express
- PostgreSQL
- Knex

### Version Control
- Git

<br>

## Installation

| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./back-end`     | The backend project, which runs on `localhost:5001` by default.  |
| `./front-end`    | The frontend project, which runs on `localhost:3000` by default. |


### Backend Existing files

The `./back-end` folder contains all the code for the backend project.

The table below describes the existing files in the `./back-end` folder:

<br>

## Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your SQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.


## Additional Information

This project was the capstone project for my software engineering certificate through Thinkful. It was a great full-stack exercise that allowed me to further solidify my skills as a developer and make several decisions regarding the project's organization and user experience. I was able to stretch myself to develop new skills including Knex Transactions, CSS animations, and troubleshooting databases.

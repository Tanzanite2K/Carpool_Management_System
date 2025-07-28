# Carpool System

Welcome to the Carpool Application repository! This project is a full-stack web application designed to facilitate ride-sharing among users. Built with modern web technologies, it allows users to sign up, sign in, share rides, search for available rides, and manage their ride requests. Below, you'll find all the necessary information to understand, set up, and contribute to this project.

## Features

- **User Authentication**: Secure sign-up and sign-in using JWT (JSON Web Tokens).
- **Ride Sharing**: Users can post rides with details like source, destination, time, and available seats.
- **Ride Search**: Users can request to join a ride, and the ride owner can approve, ignore or reject the request.
- **Ride Management**: Users can view their posted rides and the rides they are traveling to.
- **Interactive Map**: Powered by Leaflet and OpenStreetMap for visualizing ride routes.
- **UI Design**: Built with Tailwind CSS for a clean and visually appealing interface.
- **Admin panel**: Can able to see Users and there details, Ride history.


## Tech Stack

- **Frontend**: React, Leaflet & OpenStreetMap (for maps), Tailwind CSS
- **Backend**: Express, CORS, JWT
- **Database**: PostgreSQL (run using Docker)

## Setup and Installation

**Run the project**
   - For the backend:
     cd backend
     npm install
     npm run dev
     
   - For the frontend:
     cd frontend
     npm install
     npm run dev

   - For the Database:
     cd backend
     npx prisma migrate dev --name init

   - For the admin:
     cd backend
     cd scripts
     npm install
     node createAdmin.js
     
  
**Set up PostgreSQL**:
   - Ensure Docker is installed and running.
   - Start a PostgreSQL container:
     ```bash
     docker run --name flow-postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=flow -p 5432:5432 -d postgres
     ```

**Configure environment variables**:
   - Create a `.env` file in the backend directory with the following variables:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://your_user:your_password@localhost:5432/flow
     JWT_SECRET=your_jwt_secret
     ```

**Access the application**:
   Open your browser and navigate to `http://localhost:5173`.


## Acknowledgments

- [React](https://reactjs.org/) for the frontend framework.
- [Express.js](https://expressjs.com/) for the backend framework.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Leaflet](https://leafletjs.com/) for map integration.
- [OpenStreetMap](https://www.openstreetmap.org/) for map data. 
- [PostgreSQL](https://www.postgresql.org/) for the database.

---

Happy carpooling 🚀


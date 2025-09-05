# CSC309 Project - 1on1

1on1 is a web application for a host to schedule meetings with several invitees. This repo is a copy of my team's final project submission for the Winter 2024 offering of CSC309 at the University of Toronto.

Authors: Brian (Wonjun) Cho, Amiel Nurja, Kirsten Sutantyo, Arlene Wang

My contributions:
- Database schema design (calendars, events)
- API development (CRUD operations, scheduling) along with tests
- UI development (Home page, Navbar, Meeting Information)
- Deployment to AWS
  
## Setup

This project uses React as the frontend and Django as the backend. 
To setup and the React frontend, run:
```
cd frontend
npm install
npm build:css
npm start
```

To setup the backend, run:
```
cd OneOnOne
./startup.sh
```
The backend requires some environment variables to be declared. To declare these, run:
```
source setenv.sh
```
in the same directory as above. By default, the server is initalized in debug mode.
To change this, edit the environment variable declaration in the `setenv.sh` file to:
```
export DEBUG=False
```
In non-debug mode, the server will attempt to send emails via an smtp server. The smtp configurations can be done through the environment variables.
In debug mode, the server uses the Django console email backend.

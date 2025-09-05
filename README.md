# CSC309 Project 1on1

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

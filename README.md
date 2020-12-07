## Map tool

An interactive web application for viewing a map from a game. 
Used for visualizing game mechanics in a game where the players can build towers for their kingdom to increase their kingdoms influence. Live demo available [here](https://rkmap-tool.herokuapp.com/).
The backend is implemented using Node, Express, MongoDB and WebSockets. The frontend uses React and WebSockets.

### Requirements
- [Node >12.13.0](https://nodejs.org/en/)


### Setup
```
git clone git@github.com:robinkar/maptool.git
cd maptool
npm run build
```
Create and setup MongoDB database information and Express port number in the file `backend/.env`, example:

```
DB_SERVER=127.0.0.1
DB_DATABASE=mydatabase
DB_USER=myuser
DB_PASSWORD=mypassword
PORT=80
```

### Running
Run the command `npm start`.
The application should now run on the port specified in `backend/.env`.
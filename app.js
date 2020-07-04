'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const {sequelize} = require('./db');
const routes = require('./routes')

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//setup body parsing
app.use(express.json())

// routes for user and courses
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});



// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  res.status(err.status || 500).json({
    error: err,
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// helper function to start listening on our port once database connection is tested
const startServer = () => {
  const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
}

(async()=>{
    //Test database connection
    sequelize
      .authenticate()
      .then( () => console.info( "Database connection successful"))
      .catch( () => console.error("Database connection failed"))
    
    //Sync models with database
    sequelize
      .sync()
      .then( () => console.info( "Database sync successful"))
      .then( startServer )//Start server if connection is successful
      .catch( () => console.error("Database sync failed"))
})();

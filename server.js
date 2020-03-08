const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const colors = require('colors');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();
//Routes files
const bootcamps = require('./routes/bootcamps');

const app = express();
// const logger = (res, req, next) => {
//   console.log(`${req.method}`);
// };
//Body Parser
app.use(express.json());

// Dev Logging middleware
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use.logger;
//Mount Routers
app.use('/api/v1/bootcamps', bootcamps);

app.get('/', (req, res) => {
  res.send('Hello from express');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `App listening on port ${process.env.NODE_ENV}  ${PORT}`.yellow.bold
  )
);

//Handle undhandles
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error :${err.message}`.red.bold);
  //close server
  server.close(() => process.exit(1));
});

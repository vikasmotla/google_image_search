const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const searchRoutes = require('./api/routes/search');
const historyRoutes = require('./api/routes/history');


var mongoDB = 'mongodb://localhost/zillion_db3';
mongoose.connect(mongoDB);

mongoose.connection.once('open', function () {
  console.log('Connection has been made');
}).on('error',function (erro) {
  console.log('connection error');
  // console.log(error)
})

app.use('/static',express.static('static'));
app.use(bodyParser.urlencoded())
app.use(bodyParser.json());

app.use((res, req, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'PUT, PATCH, DELETE, POST, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes which should habdle requests
app.use('/search', searchRoutes);
app.use('/history', historyRoutes);
app.get('/',function (req,res) {
  res.sendFile(__dirname + '/views/index.html')
})


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.use((req, res, next) => {
  res.status(200).json({
    message: "It works!"
  });
});

module.exports = app;

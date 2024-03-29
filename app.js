const express = require('express');
const app = express();
const morgan = require('morgan');
//const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/userRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const inventoryRoutes = require('./api/routes/inventoryRoutes');

//mongoose connection
mongoose.connect('mongodb+srv://admin:adminpw@cluster0.dfhsqqe.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(express.json()) //option 1
// app.use(bodyParser.urlencoded({extended: false })); option2

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/inventory', inventoryRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    // error.status(404);
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;
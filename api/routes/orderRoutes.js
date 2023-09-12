const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const itemQuantity = require('./inventoryRoutes');

//postgres connection
const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'ordermanagement',
    password: '1234',
    port: 5432,
});

//insert order
router.post('/', (req, res, next) => {
    //new order details from fe
    const user_id = req.body.user_id;
    const product_id = req.body.product_id;
    const quantity = req.body.quantity;
    const total_price = req.body.total_price;
    const order_status = req.body.order_status;
    const shipping_address = req.body.shipping_address;
    const payment_status = req.body.payment_status;
})

//get all orders
router.get('/', (req, res, next) => {
    const query = 'SELECT * FROM orders;';
    pool.query(query, (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
            "error": error
        })
      }else{
        if(results.rowCount>0){
            console.log(results.rows);
            res.status(200).json(results.rows);
        }else{
            console.log("no order");
            res.status(404).json({
                "message": "no order"
            })
        }
      }
    });
});

//get a order by orderId
router.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    const query = 'SELECT * FROM orders WHERE order_id=$1;';
    pool.query(query, [orderId], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({
            "error": error
        })
      }else{
        if(results.rowCount>0){
            console.log(results.rows);
            res.status(200).json(results.rows);
        }else{
            console.log("order not found");
            res.status(404).json({
                "message": "order not found"
            })
        }
      }
    });
});

//update a order
router.patch('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    const newUser_id = req.body.newUser_id;
    const newProduct_id = req.body.newProduct_id;
    const newQuantity = req.body.newQuantity;
    const newTotal_price = req.body.newTotal_price;
    const newOrder_status = req.body.newOrder_status;
    const newShipping_address = req.body.newShipping_address;
    const newPayment_status = req.body.newPayment_status;

    const isFound=0;
    const queryPre = 'SELECT * FROM orders WHERE order_id=$1;';
    pool.query(queryPre, [orderId], (error, results) => {
        if(error){
            console.log(error);
            res.status(500).json({
                "error": error
            })
        }else{
            if(results.rowCount>0){
                isFound=1;
            }
        }
    })

    const query = `
        UPDATE orders
        SET
            user_id = $1,
            product_id = $2,
            quantity = $3,
            total_price = $4,
            order_status = $5,
            shipping_address = $6,
            payment_status = $7
        WHERE order_id = $8;
    `;
    
    if (isFound==1){
        pool.query(query,[newUser_id, newProduct_id, newQuantity, newTotal_price, newOrder_status, newShipping_address, newPayment_status, orderId], (error, results) => {
            if (error){
                console.log(error);
                res.status(500).json({
                    "error": error
                })
            }else{
                console.log("order updated");
                res.status(200).json({
                    "message": "order updated"
                })
            }
        })
    } else {
        console.log("order not found");
        res.status(404).json("order not found");
    }
})

//delete order
router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;

    const isFound=0;
    const queryPre = 'SELECT * FROM orders WHERE order_id=$1;';
    pool.query(queryPre, [orderId], (error, results) => {
        if(error){
            console.log(error);
            res.status(500).json({
                "error": error
            })
        }else{
            if(results.rowCount>0){
                isFound=1;
            }
        }
    })

    const query = "DELETE FROM orders WHERE order_Id=$1";

    if (isFound==1){
        pool.query(query, [orderId], (error, results) => {
            if (error){
                console.log(error);
                res.status(500).json({
                    "error": error
                });
            }else{
                console.log("order delete");
                res.status(200).json({
                    "message": "order delete"
                });
            }
        })
    } else {
        console.log("order not found");
        res.status(404).json({
            "message": "order not found"
        })
    }
})

module.exports = router;
//check to see if running production enviornment or dev enviornment
// NODE_ENV variable is set by Node.js to tell what enviornment its on
//Must do this because only the development ENV library was downloaded
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//to get secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

const express = require('express');
const app = express();
const fs = require('fs');//include library to read json file
const stripe = require('stripe')(stripeSecretKey);// creates a variable to access the Stripe API

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));

app.get('/subscriptions', function (req, res) {
    fs.readFile('items.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            res.render('subscriptions.ejs', {
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
            }) //use ejs file so templating language can be used on top
        }
    })
});

app.post('/purchase', function (req, res) {
    fs.readFile('items.json', function (error, data) {
        if (error) {
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data);
            const itemsArray = itemsJson.subscriptions.concat(itemsJson.addons); //combines all store items into one variable
            let total = 0;
            req.body.items.forEach(function (item) {
                const itemJson = itemsArray.find(function (i) {
                    return i.id == item.id //must leave with only two equals! 
                });
                total = total + itemJson.price * item.quantity //contains the total price to charge to customers credit card
            });

            stripe.charges.create({ //create is a promise.  Allows something to happen after its complete or catch errors
                amount: total, //stripe expects amount in pennies
                source: req.body.stripeTokenId,//this is the Id that will be charged
                currency: 'usd'
            }).then(function () {//if charge is successful
                console.log('Charge Successful');
                res.json({message: 'Successfully purchased items'})
            }).catch(function () { //catches if there is an error with purchase
                console.log('Charge Failed');
                res.status(500).end()
            })
        }
    })
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8080;
}
app.listen(port);

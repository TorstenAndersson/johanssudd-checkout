const express = require("express");
const app = express();
const stripe = require("stripe")("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");
//const path = require("path")
const https = require("https");
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    //const { items } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 19999, //calculateOrderAmount(items),
        currency: "sek"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
   /*
    const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                currency: "usd",
                product_data: {
                name: "T-shirt",
                },
                unit_amount: 2000,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: "https://example.com/success",
        cancel_url: "https://example.com/cancel",
    });

    res.json({ id: session.id });
    */
});

app.post("/swish", async (req, res) => {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=="x" ? r :(r&0x3|0x8)).toString(16);
    });
    //uuid

    const data = JSON.stringify({
        payeePaymentReference: "0123456789",
        callbackUrl: "https://johanssudd-checkout.herokuapp.com/callback",
        payeeAlias: "1231181189",
        currency: "SEK",
        payerAlias: "4671234768",
        amount: "100",
        message: "Johans Tisha"
    });

    const options = {
        hostname: "mss.cpc.getswish.net",
        port: 443,
        path: "/swish-cpcapi/api/v2/paymentrequests/" + uuid,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      };

      const req = https.request(options, res => {
        res.send(("statusCode: " + res.statusCode));
      
        res.on("data", d => {
          process.stdout.write(d);
        })
      })
      
      req.on("error", error => {
        res.send(error);
      })
      
      req.write(data);
      req.end();
});

app.post("/callback", (req, res) => {
    console.log(req.body);
    res.send(200);
})

app.listen(PORT, () => console.log(`Listening on port ${ PORT }!`));
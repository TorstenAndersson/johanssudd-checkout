const app = require("express")();
const stripe = require("stripe")("sk_test_51I8YS7FmFajbaU3gSJfP0DkPljsIoSfcDGGJCXLRv9Sod03rO3o5hFkP5gs3T6J7OrLTyupY6dULTzD6qMJCBTIF00YS3wnjWe");
//const path = require("path")
const request = require("request");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const fs = require('fs');

app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    //const { items } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 19999, //calculateOrderAmount(items),
        currency: "sek"
    });

    res.send({ clientSecret: paymentIntent.client_secret });
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

    request({
        method: "POST",
        uri: `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${uuid}`,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            payeePaymentReference: "0123456789",
            callbackUrl: "https://johanssudd-checkout.herokuapp.com/callback",
            payeeAlias: "1231181189",
            currency: "SEK",
            payerAlias: "4671234768",
            amount: "100",
            message: "Johans Tisha"
        }),
        agentOptions: {
            cert: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.pem'),
            key: fs.readFileSync("./ssl/Swish_Merchant_TestCertificate_1234679304.key"),
            //key: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.key'),
            ca: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.pem')
        }
    }, (error, httpResponse, body) => {
        console.log(error)
        console.log(httpResponse)
        console.log(body)
    });

    /*

    const agent = new https.Agent({
        cert: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.pem'),
        key: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.key'),
        ca: fs.readFileSync('./ssl/Swish_TLS_RootCA.pem'),
    });

    console.log("inte certifikat n??r de skapades hall??");

    const options = {
        agent: agent,
        hostname: "mss.cpc.getswish.net",
        port: 443,
        path: "/swish-cpcapi/api/v2/paymentrequests/" + uuid,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": data.length
        }
    };

    console.log("m??ste va request")

    const request = https.request(options, (response) => {
        console.log("statusCode: " + response.statusCode);
      
        response.on("data", d => {
            console.log(d);
        })
    })

    console.log("var det det?")
      
    request.on("error", error => {
        console.log(error);
    })
      
    request.write(data);
    request.end();
    */

      /*

    const agent = new https.Agent({
        cert: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.pem', { encoding: 'utf8' }),
        key: fs.readFileSync('./ssl/Swish_Merchant_TestCertificate_1234679304.key', { encoding: 'utf8' }),
        ca: fs.readFileSync('./ssl/Swish_TLS_RootCA.pem', { encoding: 'utf8' })
    });
      
      // Using Axios as HTTP library
    const client = axios.create({
        httpsAgent: agent
    });

    const data = {
        payeePaymentReference: '0123456789',
        callbackUrl: 'https://johanssudd-checkout.herokuapp.com/callback',
        payeeAlias: '1231181189',
        currency: 'SEK',
        payerAlias: '4671234768',
        amount: '100',
        message: 'Kingston USB Flash Drive 8 GB'
    };
      
    client.put(`https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${uuid}`, data)
        .then((ress) => {
            ress.send('Payment request created')
        });
        */
});

app.post("/callback", (req, res) => {
    console.log(req.body);
    res.send(200);
})

app.listen(PORT, () => console.log(`Listening on port ${ PORT }!`));
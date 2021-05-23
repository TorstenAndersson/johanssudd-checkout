const express = require("express");
const app = express();
const stripe = require("stripe")("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");
//const path = require("path")
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());

app.post("/create-checkout-session", async (req, res) => {
    /*
    const { items } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 199.99,//calculateOrderAmount(items),
        currency: "sek"
    });

    res.send({
        clientSecret: paymentIntent.client_secret
    });
    */
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
});

app.listen(PORT, () => console.log(`Listening on port ${ PORT }!`));
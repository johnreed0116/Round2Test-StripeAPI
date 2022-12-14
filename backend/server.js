// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")(
  "sk_test_51LxG7gIAzrcl9sc4CRsRMYZulXkFCLgqYjfN0Zi1s6kQv6yEWHHBOkwHgpS37WhoLpkFt76KCkpPiyZLarNxvDFg00ge43Kdhn"
);
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const YOUR_DOMAIN = "http://localhost:4242";

app.post("/create-checkout-session", async (req, res) => {
  // const price = await stripe.prices.create({
  //   product: "",
  //   unit_amount: req.body.price,
  //   currency: "usd",
  //   recurring: { interval: "month" },
  //   lookup_key: "standard_monthly",
  // });
  // console.log(products);

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price_data: {
            currency: "usd",
            product_data: { name: "T-shirt" },
            unit_amount: req.body.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
    });

    res.send({ message: "Success", status: 200, link: session.url });
  } catch (error) {
    console.log(error);
    res.send({ message: "Failed", status: 400, link: "" });
  }
  // res.redirect(303, session.url);
});

app.listen(4242, () => console.log("Running on port 4242"));

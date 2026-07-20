import express from "express";

const app = express();

/*
-------------------------------------
Body Parser
-------------------------------------
*/

app.use(express.json());

/*
-------------------------------------
Health Check
-------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Product API is running.",
  });
});

export default app;

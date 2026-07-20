import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
=====================================
🚀 Product API Started Successfully
=====================================
Server : http://localhost:${PORT}
Mode   : ${process.env.NODE_ENV}
=====================================
`);
});

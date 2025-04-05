import express from "express";
import authRouter from "./controllers/auth";

const app = express();

// Middleware setup
app.use(express.json());

app.use("/auth", authRouter);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

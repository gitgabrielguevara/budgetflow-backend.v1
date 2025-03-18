import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import userRoutes from "./routes/userRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5037;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/transactions", transactionRoutes);
app.use(bodyParser.urlencoded({ extended: true }));

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error🔥:", err);
  } else {
    console.log("Connected to the database🌈:", res.rows[0]);
  }
});

app.get("/", (req, res) => {
  res.send({ message: "BudgetFlow API is running...👟" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port 🎧${PORT}🎧`);
});

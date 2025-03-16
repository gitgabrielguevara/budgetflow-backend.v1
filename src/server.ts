import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5037;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

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

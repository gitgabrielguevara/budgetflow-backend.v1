import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5037;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "BudgetFlow API is running..." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

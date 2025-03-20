import { Router } from "express";
import {
  getTransactions,
  addTransaction,
  deleteTransaction,
} from "../controllers/transactionController";

const router = Router();

// Define routes
router.get("/", getTransactions);
router.post("/", addTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction)

export default router;

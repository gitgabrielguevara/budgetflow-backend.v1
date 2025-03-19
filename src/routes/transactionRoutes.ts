import { Router } from "express";
import {
  getTransactions,
  addTransaction,
} from "../controllers/transactionController";

const router = Router();

// Define routes
router.get("/", getTransactions);
router.post("/", addTransaction);

export default router;

import express from "express";
import { getTransactions } from "../controllers/transactionController";

const router = express.Router();

router.get("/", getTransactions);

export default router;

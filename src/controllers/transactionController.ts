import { Request, Response } from "express";
import db from "../config/db";
import { transcode } from "buffer";

interface TransactioQuery {
  type?: string;
}

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    let query = "SELECT * FROM transactions";

    if (type) {
      query += ` WHERE type =$1`; // prevent SQL injection
    }

    const { rows } = await db.query(query, type ? [type] : []);

    res.status(200).json({ success: true, transactions: rows });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error " });
  }
};

// const getTransactions = async (
//   req: Request<{}, {}, {}, TransactioQuery>,
//   res: Response
// ) => {
//   const { type } = req.query;
// };

import { Request, Response } from "express";
import pool from "../config/db";

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type } = req.query;
    let query = "SELECT * FROM transactions";
    let values: any[] = [];

    if (type) {
      query += " WHERE type = $1";
      values.push(type);
    }

    const { rows } = await pool.query(query, values);
    res.status(200).json({ success: true, transactions: rows });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, amount, date, category_id, type, notes } = req.body;

    if (!user_id || !amount || !date || !type) {
      res.status(400).json({ message: "Missing required fields 🌾" });
      return;
    }

    const query = ` 
      INSERT INTO transactions (user_id, amount, date, category_id, type, notes)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    const values = [
      user_id,
      amount,
      date,
      category_id ? category_id : null,
      type,
      notes ? notes : null,
    ];

    const result = await pool.query(query, values);
    res.status(201).json({
      success: true,
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Server Error 💀" });
  }
};

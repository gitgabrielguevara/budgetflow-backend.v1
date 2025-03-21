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

export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // check if the transaction exist
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    if (transaction.rows.length === 0) {
      res.status(404).json({ message: "Transaction not found 🧐" });
      return;
    }

    // Delete transaction
    await pool.query("DELETE from transactions WHERE id =$1", [id]);

    res.status(200).json({ success: true, message: "Transaction deleted 😵" });
  } catch (error) {
    console.error("Error deleting transacton: 👎", error);
    res.status(500).json({ message: "Server Error 💀" });
  }
};

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, amount, date, category_id, type, notes } = req.body;

    //check if the transaction exist
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    if (transaction.rows.length === 0) {
      res.status(404).json({ message: "Transaction not found 🧐" });
      return;
    }

    // Ensure at least one field is provided for the udpate
    if (!user_id && !amount && !date && !category_id && !type && !notes) {
      res.status(400).json({ message: "No field provided for the update 🫤" });
      return;
    }

    // Initialize the dynamic query based on provided fields
    let updateQuery = "UPDATE transaction SET";
    let values: any[] = [];
    let counter = [];

    if (user_id) {
      counter.push(`user_id = $${counter.length + 1}`);
      values.push(user_id);
    }
    if (amount) {
      counter.push(`amount = $${counter.length + 1}`);
      values.push(amount);
    }
    if (date) {
      counter.push(`date = $${counter.length + 1}`);
      values.push(date);
    }
    if (category_id) {
      counter.push(`category_id = $${counter.length + 1}`);
      values.push(category_id);
    }
    if (type) {
      counter.push(`type = $${counter.length + 1},`);
      values.push(type);
    }
    if (notes) {
      counter.push(`notes = $${counter.length + 1},`);
      values.push.apply(notes);
    }

    if (counter.length === 0) {
      res.status(400).json({
        message: "No valid fields provided for updating the transaction 🌾",
      });
      return;
    }

    // Remove the last comma and add WHERE clause
    updateQuery =
      updateQuery.slice(0, -2) + ` WHERE id = $${counter} RETURNING *`;
    values.push(id);

    // Execute the udpate query
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Transaction updated 🎉",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating transaction: ⛔️", error);
    res.status(500).json({ message: "Server Error 💀" });
  }
};

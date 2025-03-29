import { Request, Response } from "express";
import { Transaction } from "../models/transactionModel";
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
    const { user_id, amount, date, recurrence, category_id, type, notes } =
      req.body;

    if (!user_id || !amount || !date || !type) {
      res.status(400).json({ message: "Missing required fields 🌾" });
      return;
    }

    const query = ` 
      INSERT INTO transactions (user_id, amount, date, recurrence, category_id, type, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
    `;

    const values = [
      user_id,
      amount,
      date,
      recurrence || "none",
      category_id ? category_id : null,
      type,
      notes ? notes : null,
    ];
    const recurrenceValue = recurrence || "none";

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

export const checkRecurringTransaction = async (
  id: number
): Promise<string> => {
  const result = await pool.query(
    "SELECT recurrence FROM transactions WHERE id = $1",
    [id]
  );
  if (result.rows.length === 0) return "Transaction not found";
  return result.rows[0].recurrence;
};

export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: " Invalid transaction ID format 🧮" });
      return;
    }
    const { user_id, amount, date, recurrence, category_id, type, notes } =
      req.body;

    //check if the transaction exist
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [id]
    );

    //check if the transaction is recurring
    const recurrenceStatus = await checkRecurringTransaction(id);
    if (recurrenceStatus === "Transaction not found") {
      res.status(400).json({ message: "Transaction not found 😯" });
    }
    console.log("Recurrence", recurrence);

    if (transaction.rows.length === 0) {
      res.status(404).json({ message: "Transaction not found 🧐" });
      return;
    }

    // Ensure at least one field is provided for the udpate
    if (
      !user_id &&
      !amount &&
      !date &&
      recurrence &&
      !category_id &&
      !type &&
      !notes
    ) {
      res.status(400).json({ message: "No field provided for the update 🫤" });
      return;
    }

    // Initialize the dynamic query based on provided fields
    let updateFields: string[] = [];
    let values: any[] = [];
    let counter: string[] = [];

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
      counter.push(`type = $${counter.length + 1}`);
      values.push(type);
    }
    if (notes) {
      counter.push(`notes = $${counter.length + 1}`);
      values.push(notes);
    }

    values.push(id);

    if (values.length === 0) {
      res.status(400).json({
        message: "No valid fields provided for updating the transaction 🌾",
      });
      return;
    }

    // Finalize the query
    let updateQuery = `UPDATE transactions SET ${counter.join(
      ", "
    )} WHERE id = $${counter.length + 1} RETURNING *`;

    // Check the query and values
    console.log("Final Query:", updateQuery);
    console.log("Values:", values);

    // Execute the udpate query
    const result = await pool.query(updateQuery, values);

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully! ✅",
      transaction: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating transaction: ⛔️", error);
    res.status(500).json({ message: "Server Error 💀" });
  }
};

import express from "express";
import db from "#db/client";
const app = express();
export default app;

// TODO: this file!
app.get("/employees", async (_req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM employees ORDER BY id;");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

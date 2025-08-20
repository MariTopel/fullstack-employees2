import express from "express";
import db from "#db/client";
const app = express();
export default app;
app.use(express.json());

const isDigitsOnly = (s) => /^\d+$/.test(String(s));

const isPositiveInt = (s) => /^[1-9]\d*$/.test(String(s));

app.get("/employees/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!isDigitsOnly(id)) return res.sendStatus(400);

  try {
    const { rows } = await db.query("SELECT * FROM employees WHERE id = $1;", [
      Number(id),
    ]);
    if (rows.length === 0) return res.sendStatus(404);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// TODO: this file!
app.get("/employees", async (_req, res, next) => {
  try {
    const { rows } = await db.query("SELECT * FROM employees ORDER BY id;");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

app.get("/", (_req, res) => {
  res.send("Welcome to the Fullstack Employees API.");
});

app.post("/employees", async (req, res, next) => {
  try {
    // 400 if no body or empty body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.sendStatus(400);
    }

    const { name, birthday, salary } = req.body;

    // 400 if any required field is missing (allow salary=0)
    if (!name || !birthday || salary === undefined) {
      return res.sendStatus(400);
    }

    const sql = `
      INSERT INTO employees (name, birthday, salary)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const { rows } = await db.query(sql, [name, birthday, salary]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

app.delete("/employees/:id", async (req, res, next) => {
  const { id } = req.params;

  // 400 if not plain digits (rejects "1e10", "-1", etc.)
  if (!isDigitsOnly(id)) return res.sendStatus(400);

  try {
    const { rows } = await db.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *;",
      [Number(id)]
    );
    if (rows.length === 0) return res.sendStatus(404);
    // success but no body
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

app.put("/employees/:id", async (req, res, next) => {
  const { id } = req.params;

  // 400 if no body or empty body
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.sendStatus(400);
  }

  const { name, birthday, salary } = req.body;

  // 400 if missing required fields (allow salary = 0)
  if (!name || !birthday || salary === undefined) {
    return res.sendStatus(400);
  }

  // 400 if id is not plain digits (rejects "1e10", "-1", etc.)
  if (!isDigitsOnly(id)) return res.sendStatus(400);

  try {
    const { rows } = await db.query(
      `UPDATE employees
       SET name = $2, birthday = $3, salary = $4
       WHERE id = $1
       RETURNING *;`,
      [Number(id), name, birthday, salary]
    );
    if (rows.length === 0) return res.sendStatus(404);
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

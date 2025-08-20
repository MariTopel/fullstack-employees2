import db from "#db/client";

await db.connect();
await seedEmployees();
await db.end();
console.log("🌱 Database seeded.");

async function seedEmployees() {
  //TRUNCATE...RESTART IDENTITY makes it so the test starts at 1
  await db.query("TRUNCATE TABLE employees RESTART IDENTITY CASCADE;");

  const employees = [
    { name: "Jeremy Beramy", birthday: "1200-01-01", salary: 500000 },
    { name: "Kongle Bonchman", birthday: "1500-03-11", salary: 400000 },
    { name: "Tingus Lorkus", birthday: "1900-01-01", salary: 700000 },
    { name: "BingBong Blonkman", birthday: "1300-10-01", salary: 300000 },
    { name: "Purple Rain", birthday: "2000-08-17", salary: 350000 },
    { name: "Chingus Blargus", birthday: "1990-05-22", salary: 210000 },
    { name: "Kinkle Lingle", birthday: "1700-07-11", salary: 520000 },
    { name: "Frunch Drinkle", birthday: "1400-03-15", salary: 130000 },
    { name: "Plent Wrengle", birthday: "1700-02-21", salary: 790000 },
    { name: "Slime Prime", birthday: "1500-01-31", salary: 350000 },
    { name: "Isabelle Binkle", birthday: "1600-09-11", salary: 610000 },
  ];

  for (const e of employees) {
    await db.query(
      "INSERT INTO employees (name, birthday, salary) VALUES ($1, $2, $3);",
      [e.name, e.birthday, e.salary]
    );
  }
}

DROP TABLE IF EXISTS employees;

--create employee table
CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    birthday DATE NOT NULL,
    salary INTERGER NOT NULL
);



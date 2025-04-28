const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const app = express();
const port = 3000;

// Database connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "bookportal3",
  port: 3306,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Successfully connected to the database!");
  connection.release();
});

// Serve static files
app.use(express.static(path.join(__dirname, "")));
app.use("/HTML", express.static(path.join(__dirname, "HTML")));
app.use("/CSS", express.static(path.join(__dirname, "CSS")));
app.use("/JavaScript", express.static(path.join(__dirname, "JavaScript")));
app.use("/Media", express.static(path.join(__dirname, "Media")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve contactUs.html for root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML", "contactUs.html"));
});

// Handle contact form submission (Shatha updated)
app.post("/submit-contact", (req, res) => {
  console.log("Received data:", req.body);
  const { Fname, Lname, gender, mobile, DB, email, language, message = "" } = req.body;

  const errors = {};

  // Validate First Name
  if (!Fname || !/^[a-zA-Z]{2,12}$/.test(Fname)) {
    errors.Fname = "First name must be 2-12 letters only.";
  }

  // Validate Last Name
  if (!Lname || !/^[a-zA-Z]{2,12}$/.test(Lname)) {
    errors.Lname = "Last name must be 2-12 letters only.";
  }

  // Validate Gender
  if (!gender || !["Male", "Female"].includes(gender)) {
    errors.gender = "Gender must be selected.";
  }

  // Validate Mobile
  if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
    errors.mobile = "Mobile must be exactly 10 digits.";
  }

  // Validate Date of Birth
  if (!DB || isNaN(Date.parse(DB)) || new Date(DB) >= new Date()) {
    errors.DB = "Date of birth must be a valid past date.";
  }

  // Validate Email
  if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
    errors.email = "Invalid email format.";
  }

  // Validate Language
  if (!language || !["Arabic", "English", "French"].includes(language)) {
    errors.language = "Please select a valid language.";
  }

  // If there are any validation errors, return them
  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors);
    return res.status(400).json({ errors });
  }

  // If no errors, insert into database
  const insertQuery = `
    INSERT INTO ContactUs 
    (Fname, Lname, gender, mobile, DB, email, language, message) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    Fname.trim(),
    Lname.trim(),
    gender,
    mobile.trim(),
    DB,
    email.trim(),
    language,
    message.trim()
  ];

  pool.query(insertQuery, values, (err, results) => {
    if (err) {
      console.error("Database insert error:", err.message, err.sql);
      return res.status(500).json({ errors: `Database error: ${err.message}` });
    }
    console.log("Data saved successfully!", results);
    res.status(200).json({ message: "Success", Fname, email });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
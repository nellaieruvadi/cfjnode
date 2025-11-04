// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const router = express.Router();

// ===== EXISTING: REGISTER ROUTE (unchanged) =====
router.post('/register', async (req, res) => {
  const {
    email,
    password,
    userType, // 'candidate' or 'employer'
    name,
    fullName,
    contactNumber,
    city,
    country
  } = req.body;

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password with bcrypt (salt included)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into Users table
    const [result] = await pool.query(`
      INSERT INTO Users (Email, PasswordHash, UserType)
      VALUES (?, ?, ?)
    `, [email, hashedPassword, userType]);

    const userId = result.insertId;

    // Insert into profile table based on userType
    if (userType === 'candidate') {
      await pool.query(`
        INSERT INTO CandidateProfile
        (CandidateID, Name, FullName, ContactNumber, City, Country)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, name, fullName, contactNumber, city, country]);
    } else if (userType === 'employer') {
      await pool.query(`
        INSERT INTO EmployerProfile
        (EmployerID, ContactPerson, CompanyName, ContactNumber, City, Country)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [userId, name, fullName, contactNumber, city, country]);
    }

    res.status(201).json({ message: 'User registered successfully', userId });

  } catch (error) {
      console.error('Registration error:', error); // Add this for full trace
      res.status(500).json({ message: 'Server error' });
  }
});
// ===== END REGISTER =====


// ===== MODIFIED: add login + logout routes wired to your controller =====
const { loginUser, logoutUser } = require('../controllers/loginController');

// POST /auth/login  -> handled by controllers/userController.loginUser
// Make sure the form action is '/auth/login' (or adjust accordingly)
router.post('/login', loginUser);

// GET /auth/logout  -> handled by controllers/userController.logoutUser
router.get('/logout', logoutUser);
// ===== END MODIFIED =====


module.exports = router;

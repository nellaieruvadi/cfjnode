const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
    const {
      userType,
      username,
      email,
      password,
      contactNumber,
      linkedin,
      city,
      country,
      gender,
      dob,
      companyName,
      contactPerson,
      website
    } = req.body;

    // Validate required fields
    if (!userType || !username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalize optional fields to null
    const insertValues = [
      userType,
      username,
      email,
      hashedPassword,
      contactNumber && contactNumber !== '' ? contactNumber : null,
      linkedin && linkedin !== '' ? linkedin : null,
      city && city !== '' ? city : null,
      country && country !== '' ? country : null,
      gender && gender !== '' ? gender : null,
      dob && dob !== '' ? dob : null,
      companyName && companyName !== '' ? companyName : null,
      contactPerson && contactPerson !== '' ? contactPerson : null,
      website && website !== '' ? website : null
    ];

    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO users 
        (userType, username, email, password, contactNumber, linkedin, city, country, gender, dob, companyName, contactPerson, website) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      insertValues
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

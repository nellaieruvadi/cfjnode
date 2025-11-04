// controllers/loginController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).render('login', { error: 'Email and password are required' });
    }

    // Check if user exists
    const [rows] = await pool.execute(
      `SELECT id, username, email, password, userType FROM users WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).render('login', { error: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { error: 'Invalid email or password' });
    }

    // ===== MODIFIED =====
    // Server-rendered session flow
    req.session.regenerate(err => {
      if (err) {
        console.error('Session regenerate error:', err);
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType
        };
      } else {
        req.session.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType
        };
      }

      req.session.save(saveErr => {
        if (saveErr) console.error('Session save error:', saveErr);
        return res.redirect('/'); // redirect to home page after login
      });
    });
    // ===== END MODIFIED =====

  } catch (err) {
    console.error(err);
    return res.status(500).render('login', { error: 'Server error' });
  }
};

// Optional logout handler
exports.logoutUser = (req, res) => {
  if (!req.session) return res.redirect('/login');

  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).render('error', { error: 'Failed to logout' });
    }
    res.clearCookie('sid'); // make sure cookie name matches app.js session name
    return res.redirect('/login');
  });
};

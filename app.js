const express = require("express");
const session = require('express-session');
const path = require("path");
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Body parsing middleware (only once)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------- SESSION & AUTH SETUP -----------------
// Initialize session middleware (must be before routes that rely on req.session)
if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET must be set in environment variables');
  console.error('Generate one using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // set true for HTTPS in production
  })
);

// Expose session user to EJS templates (after session middleware)
app.use((req, res, next) => {
  res.locals.currentUser = req.session && req.session.user ? req.session.user : null;
  res.locals.username = req.session && req.session.user ? req.session.user.username : null;
  next();
});
// --------------------------------------------------------

// Import routes AFTER session middleware so they see req.session
const authRoutes = require('./routes/auth');
const pageRoutes = require("./routes/index");
const userRoutes = require('./routes/userRoutes');

// Mount routes
app.use("/auth", authRoutes);
app.use("/", pageRoutes);
app.use('/api/users', userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

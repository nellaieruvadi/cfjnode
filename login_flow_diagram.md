# Login Flow Diagram for cfjnode Application

## Overview
This document describes the complete authentication flow from when a user visits the login page to being redirected to the home page.

---

## Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. GET /login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          app.js (Express)                        │
│  • Session middleware initialized (express-session)              │
│  • Body parser middleware (express.urlencoded, express.json)     │
│  • Routes mounted: /auth, /, /api/users                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Route: GET /login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    routes/index.js                               │
│  router.get("/login", pageController.loginPage)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              controllers/pageController.js                       │
│  exports.loginPage = (req, res) => {                             │
│    res.render("pages/login", {                                   │
│      title: "Login",                                             │
│      pagename: "login",                                          │
│      username: req.session.user?.username || null                │
│    });                                                            │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 2. Render login.ejs
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      views/pages/login.ejs                       │
│  • Login form with email and password fields                     │
│  • Form action: POST /auth/login                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 3. User enters credentials
                              │    and submits form
                              │    POST /auth/login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                          app.js (Express)                        │
│  • Body parser extracts email and password from request          │
│  • Session middleware available (req.session)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Route: POST /auth/login
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       routes/auth.js                             │
│  const { loginUser } = require('../controllers/loginController');│
│  router.post('/login', loginUser);                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│            controllers/loginController.js                        │
│  exports.loginUser = async (req, res) => {                       │
│    try {                                                          │
│      const { email, password } = req.body;                       │
│                                                                   │
│      // 4. Validate input                                        │
│      if (!email || !password) {                                  │
│        return res.status(400).render('login', {                  │
│          error: 'Email and password are required'                │
│        });                                                        │
│      }                                                            │
│                                                                   │
│      // 5. Query database for user                               │
│      const [rows] = await pool.execute(                          │
│        'SELECT id, username, email, password, userType           │
│         FROM users WHERE email = ?', [email]                     │
│      );                                                           │
│                                                                   │
│      if (rows.length === 0) {                                    │
│        return res.status(401).render('login', {                  │
│          error: 'Invalid email or password'                      │
│        });                                                        │
│      }                                                            │
│                                                                   │
│      const user = rows[0];                                       │
│                                                                   │
│      // 6. Compare passwords with bcrypt                         │
│      const isMatch = await bcrypt.compare(password,              │
│                                            user.password);        │
│      if (!isMatch) {                                             │
│        return res.status(401).render('login', {                  │
│          error: 'Invalid email or password'                      │
│        });                                                        │
│      }                                                            │
│                                                                   │
│      // 7. Create session                                        │
│      req.session.regenerate(err => {                             │
│        req.session.user = {                                      │
│          id: user.id,                                            │
│          username: user.username,                                │
│          email: user.email,                                      │
│          userType: user.userType                                 │
│        };                                                         │
│                                                                   │
│        req.session.save(saveErr => {                             │
│          return res.redirect('/');  // 8. Redirect to home       │
│        });                                                        │
│      });                                                          │
│    } catch (err) {                                               │
│      console.error(err);                                         │
│      return res.status(500).render('login', {                    │
│        error: 'Server error'                                     │
│      });                                                          │
│    }                                                              │
│  };                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 8. Session saved, redirect to /
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    routes/index.js                               │
│  const { ensureLoggedIn } = require("../controllers/             │
│                                      pageController");            │
│  router.get("/", ensureLoggedIn, pageController.homePage);       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 9. Check if user is logged in
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              controllers/pageController.js                       │
│  function ensureLoggedIn(req, res, next) {                       │
│    if (!req.session.user) {                                      │
│      return res.redirect('/auth/login');                         │
│    }                                                              │
│    next();  // User is logged in, continue                       │
│  }                                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 10. User is authenticated
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              controllers/pageController.js                       │
│  exports.homePage = async (req, res) => {                        │
│    try {                                                          │
│      const keyword = req.query.keyword || 'it-jobs';             │
│      const country = req.query.country || 'IN';                  │
│                                                                   │
│      // 11. Fetch jobs from Adzuna API                           │
│      const { jobs, fullURL } = await adzunaService               │
│                          .fetchJobsByCountry(keyword, country);  │
│                                                                   │
│      // 12. Render home page with user data                      │
│      res.render("pages/home", {                                  │
│        title: "Home",                                            │
│        keyword,                                                  │
│        country,                                                  │
│        fullURL,                                                  │
│        jobsCountry: jobs,                                        │
│        username: req.session.user.username  // From session      │
│      });                                                          │
│    } catch (err) {                                               │
│      res.status(500).render('error', {                           │
│        error: 'Failed to load home page'                         │
│      });                                                          │
│    }                                                              │
│  };                                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ 13. Display home page
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      views/pages/home.ejs                        │
│  • Shows job listings                                            │
│  • Displays username from session                                │
│  • User is now authenticated                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                       config/db.js                               │
│  const pool = mysql.createPool({                                 │
│    host: process.env.DB_HOST,                                    │
│    user: process.env.DB_USER,                                    │
│    password: process.env.DB_PASS,                                │
│    database: process.env.DB_NAME                                 │
│  });                                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Used by loginController
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MySQL Database                             │
│  Table: users                                                    │
│  • id (PRIMARY KEY)                                              │
│  • username                                                      │
│  • email (UNIQUE)                                                │
│  • password (bcrypt hashed)                                      │
│  • userType (candidate/employer)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Components Summary

### Files Involved in Login Flow:

1. **app.js**
   - Main application entry point
   - Initializes express-session middleware
   - Mounts routes (/auth, /, /api/users)
   - Sets up body parsers

2. **routes/index.js**
   - Defines GET /login route → pageController.loginPage
   - Defines GET / route → ensureLoggedIn middleware → pageController.homePage

3. **routes/auth.js**
   - Defines POST /auth/login route → loginController.loginUser
   - Defines GET /auth/logout route → loginController.logoutUser

4. **controllers/pageController.js**
   - loginPage(): Renders the login form
   - homePage(): Renders home page with job listings
   - ensureLoggedIn(): Middleware to protect routes

5. **controllers/loginController.js**
   - loginUser(): Handles login authentication
     - Validates input
     - Queries database
     - Compares passwords with bcrypt
     - Creates session
     - Redirects to home page
   - logoutUser(): Handles logout (destroys session)

6. **config/db.js**
   - MySQL connection pool
   - Used by loginController to query users table

7. **services/adzunaService.js**
   - Fetches job listings from Adzuna API
   - Used by homePage after successful login

---

## Session Flow

1. **Session Creation** (app.js lines 29-36)
   - express-session middleware creates session on first request
   - Session cookie sent to browser

2. **Session Storage** (loginController.js lines 34-56)
   - On successful login, user data stored in req.session.user
   - Session data: { id, username, email, userType }

3. **Session Verification** (pageController.js lines 4-9)
   - ensureLoggedIn middleware checks req.session.user
   - If not present, redirects to /auth/login
   - If present, allows access to protected routes

4. **Session Destruction** (loginController.js lines 66-77)
   - logoutUser() calls req.session.destroy()
   - Clears session cookie
   - Redirects to /login

---

## Error Handling

- **Missing credentials**: Returns 400 with error message
- **User not found**: Returns 401 with "Invalid email or password"
- **Wrong password**: Returns 401 with "Invalid email or password"
- **Server error**: Returns 500 with "Server error"
- **Session errors**: Logged to console but login continues

---

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **Session Security**: express-session with secret
3. **Input Validation**: Checks for empty fields
4. **SQL Injection Prevention**: Parameterized queries (pool.execute)
5. **Error Obfuscation**: Same message for wrong email/password
6. **Session Regeneration**: New session ID on login

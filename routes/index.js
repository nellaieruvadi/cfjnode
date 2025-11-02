const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
router.use("/users", userRoutes);

const pageController = require("../controllers/pageController");
const jobController = require("../controllers/jobController");
const axios = require('axios');

// ===== MODIFIED =====
// Import the ensureLoggedIn middleware from pageController
// (ensureLoggedIn checks req.session.user and redirects to /auth/login if not logged in)
const { ensureLoggedIn } = require("../controllers/pageController");
// ===== END MODIFIED =====

// ===== MODIFIED =====
// Protect the home route so only logged-in users can access it.
// If you prefer home to be public, remove ensureLoggedIn from this route.
router.get("/", ensureLoggedIn, pageController.homePage);
// ===== END MODIFIED =====

router.get("/about", pageController.aboutPage);
router.get("/contact", pageController.contactPage);
router.get("/index", pageController.indexPage);
router.get("/jobdetail", pageController.jobdetailPage);
router.get("/joblist", pageController.joblistPage);
router.get("/jobsearchtips", pageController.jobsearchtipsPage);
router.get("/resumetips", pageController.resumetipsPage);

// ===== MODIFIED =====
// Protect job form — only logged-in users can access job posting/search form
router.get("/jobform", ensureLoggedIn, pageController.jobformPage);
// ===== END MODIFIED =====

router.get("/register", pageController.registerPage);
router.get("/login", pageController.loginPage);

router.get("/uaevisa", pageController.uaevisaPage);
router.get("/uaejobsites", pageController.uaejobsitesPage);

// Jobs via Adzuna
router.get("/jobs", jobController.getJobs);
router.get("/jobscountry", jobController.getJobsCountry);

module.exports = router;

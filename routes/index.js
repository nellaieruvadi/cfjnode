const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
router.use("/users", userRoutes);

const pageController = require("../controllers/pageController");
const jobController = require("../controllers/jobController");

// Import the ensureLoggedIn middleware from pageController
// Use this middleware on routes that require authentication
const { ensureLoggedIn } = require("../controllers/pageController");

// Home page is now public - users can view without logging in
router.get("/", pageController.homePage);

router.get("/about", pageController.aboutPage);
router.get("/contact", pageController.contactPage);
router.get("/index", pageController.indexPage);
router.get("/jobdetail", pageController.jobdetailPage);
router.get("/joblist", pageController.joblistPage);
router.get("/jobsearchtips", pageController.jobsearchtipsPage);
router.get("/resumetips", pageController.resumetipsPage);

// Protected route - requires login
// Add ensureLoggedIn middleware to any route that needs authentication
router.get("/jobform", ensureLoggedIn, pageController.jobformPage);

router.get("/register", pageController.registerPage);
router.get("/login", pageController.loginPage);

router.get("/uaevisa", pageController.uaevisaPage);
router.get("/uaejobsites", pageController.uaejobsitesPage);

// Jobs via Adzuna
router.get("/jobs", jobController.getJobs);
router.get("/jobscountry", jobController.getJobsCountry);

module.exports = router;

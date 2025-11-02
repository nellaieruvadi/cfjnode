const adzunaService = require('../services/adzunaService'); // keep this import

// ✅ Helper to check login session
function ensureLoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login'); // redirect if not logged in
  }
  next();
}

// ✅ Updated homePage to show username if logged in
exports.homePage = async (req, res) => {
  const keyword = req.query.keyword || 'it-jobs';
  const country = req.query.country || 'IN'; // default to India
  const { jobs, fullURL } = await adzunaService.fetchJobsByCountry(keyword, country);

  res.render("pages/home", {
    title: "Home",
    keyword,
    country,
    fullURL,
    jobsCountry: jobs,
    username: req.session.user ? req.session.user.username : null // ✅ Pass username to EJS
  });
};

// ✅ For other pages, also pass username (optional)
exports.aboutPage = (req, res) => {
  res.render("pages/about", { title: "About Us", username: req.session.user?.username || null });
};

exports.contactPage = (req, res) => {
  res.render("pages/contact", { title: "Contact Us", username: req.session.user?.username || null });
};

exports.indexPage = (req, res) => {
  res.render("pages/index", { title: "Index Home Page", username: req.session.user?.username || null });
};

exports.joblistPage = (req, res) => {
  res.render("pages/joblist", { title: "Job List", pagename: "job list", username: req.session.user?.username || null });
};

exports.jobdetailPage = (req, res) => {
  res.render("pages/jobdetail", { title: "Job Details", username: req.session.user?.username || null });
};

exports.jobsearchtipsPage = (req, res) => {
  res.render("pages/jobsearchtips", { title: "Job Search Tips", username: req.session.user?.username || null });
};

exports.resumetipsPage = (req, res) => {
  res.render("pages/resumetips", { title: "Resume Tips", username: req.session.user?.username || null });
};

exports.jobformPage = (req, res) => {
  res.render("pages/jobform", { title: "Job Search Form", username: req.session.user?.username || null });
};

exports.registerPage = (req, res) => {
  res.render("pages/register", { title: "Register", pagename: "register", username: req.session.user?.username || null });
};

exports.loginPage = (req, res) => {
  res.render("pages/login", { title: "Login", pagename: "login", username: req.session.user?.username || null });
};

exports.uaevisaPage = (req, res) => {
  res.render("pages/uae/uaevisa", { title: "UAE Visa Details", username: req.session.user?.username || null });
};

exports.uaejobsitesPage = (req, res) => {
  res.render("pages/uae/uaejobsites", { title: "UAE Job Sites", username: req.session.user?.username || null });
};

// ✅ Export the middleware to protect routes if needed
exports.ensureLoggedIn = ensureLoggedIn;

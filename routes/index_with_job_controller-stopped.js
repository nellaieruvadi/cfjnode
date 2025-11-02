const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");
const axios = require('axios');

router.get("/", pageController.homePage);
router.get("/about", pageController.aboutPage);
router.get("/contact", pageController.contactPage);
router.get("/index", pageController.indexPage);
router.get("/jobdetail", pageController.jobdetailPage);
router.get("/joblist", pageController.joblistPage);
router.get("/jobsearchtips", pageController.jobsearchtipsPage);


/* START: Adzuna */

const APP_ID = 'f535a364';     // Replace with your Adzuna app_id
const APP_KEY = '7ab12cf8dab485f7c88a0018c9a52440';   // Replace with your Adzuna app_key

router.get('/jobs', async (req, res) => {
  const keyword = req.query.keyword || 'it-jobs';
  const location = req.query.location || 'Tamil Nadu';

  const apiURL = 'https://api.adzuna.com/v1/api/jobs/in/search/1';

   const fullURL = `${apiURL}?app_id=${APP_ID}&app_key=${APP_KEY}&what=${encodeURIComponent(keyword)}&where=${encodeURIComponent(location)}&results_per_page=10`; 

    /*
  try {
    const response = await axios.get(apiURL, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: keyword,
        where: location,
        results_per_page: 10,
        contentType: 'application/json',
      }
    });
    
    */

    try {
    const response = await axios.get(fullURL)
  
    
    const jobs = response.data.results;
    res.render('pages/jobs', { jobs, keyword, location, fullURL });

  } catch (err) {
    console.error('Adzuna API error:', err.message);
    res.render('pages/jobs', { jobs: [], keyword, location, fullURL });
  }
});



/* END: Adzuna */



module.exports = router;

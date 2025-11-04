const adzunaService = require('../services/adzunaService');

const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || 'it-jobs';
    const location = req.query.location || 'Tamil Nadu';

    const { jobs, fullURL } = await adzunaService.fetchJobs(keyword, location);
    res.render('pages/jobs', { jobs, keyword, location, fullURL });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).render('error', { error: 'Failed to fetch jobs' });
  }
};

const getJobsCountry = async (req, res) => {
  try {
    const keyword = req.query.keyword || 'it-jobs';
    const country = req.query.country || 'IN'; // Default to India

    const { jobs, fullURL } = await adzunaService.fetchJobsByCountry(keyword, country);
    res.render('pages/jobscountry', { jobs, keyword, country, fullURL });
  } catch (err) {
    console.error('Error fetching jobs by country:', err);
    res.status(500).render('error', { error: 'Failed to fetch jobs' });
  }
};

module.exports = { getJobs, getJobsCountry };
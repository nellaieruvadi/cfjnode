const adzunaService = require('../services/adzunaService');

const getJobs = async (req, res) => {
  const keyword = req.query.keyword || 'it-jobs';
  const location = req.query.location || 'Tamil Nadu';

  const { jobs, fullURL } = await adzunaService.fetchJobs(keyword, location);
  res.render('pages/jobs', { jobs, keyword, location, fullURL });
};

const getJobsCountry = async (req, res) => {
  const keyword = req.query.keyword || 'it-jobs';
  const country = req.query.country || 'IN'; // Default to India

  const { jobs, fullURL } = await adzunaService.fetchJobsByCountry(keyword, country);
  res.render('pages/jobscountry', { jobs, keyword, country, fullURL });
};



module.exports = { getJobs, getJobsCountry };
exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).render('error', { error: 'Failed to logout' });
    }
    res.clearCookie('sid'); // match session cookie name
    return res.redirect('/login'); // redirect to login page
  });
};

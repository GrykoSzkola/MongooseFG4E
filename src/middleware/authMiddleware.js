const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/pet/dashboard');
  }
  next();
};

module.exports = { ensureAuthenticated, redirectIfAuthenticated };
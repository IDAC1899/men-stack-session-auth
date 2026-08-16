const addUserToViews = (req, res, next) => {
  const { user } = req.session;
  if (user) {
    res.locals.user = user;
  } else {
    res.locals.user = null;
  }

  next();
};

module.exports = addUserToViews;
// route middleware to make sure a user is logged in
export function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // if they aren't redirect them to the home page
  req.toastr.warning('Login required', 'Please login and then proceed!', {
    "positionClass": "toast-bottom-right"
  });
  res.redirect('/');
}

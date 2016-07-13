import express from 'express';
import connectEnsureLogin from 'connect-ensure-login';
/* eslint new-cap: 0 */
const router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  console.log(req.user);
  res.render('index.html', {user: req.user});
});

router.get('/profile',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res)=> {
    res.render('profile.html', {user: req.user});
  });
export default router;

import express from 'express';
import {isLoggedIn} from '../middlewares/auth';

/* eslint new-cap: 0 */
const router = express.Router();

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.render('index.nunj', {user: req.user});
});

router.get('/search',
  // isLoggedIn,
  (req, res, next) => {
    /* eslint-enable no-unused-vars */
    res.render('search.nunj', {user: req.user});
  });

router.get('/report',
  // isLoggedIn,
  (req, res, next) => {
    /* eslint-enable no-unused-vars */
    res.render('report.nunj', {user: req.user});
  });


router.get('/profile', isLoggedIn, (req, res)=> {
  res.render('profile.nunj', {user: req.user});
});
export default router;

import express from 'express';
import passport from 'passport';

/* eslint new-cap: 0 */
const router = express.Router();

/* GET users listing. */
/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.render('login.html');
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/return', passport.authenticate('facebook', {failureRedirect: '/login'}),
  (req, res)=> {
    res.redirect('/');
  });


export default router;

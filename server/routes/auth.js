import express from 'express';
import passport from 'passport';

/* eslint new-cap: 0 */
const router = express.Router();

router.get('/login', passport.authenticate('facebook'));

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/return', passport.authenticate('facebook', {failureRedirect: '/auth'}),
  (req, res)=> {
    res.redirect('/');
  });


export default router;

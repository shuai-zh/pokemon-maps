import async from 'async';
import csrf from 'csurf';
import express from 'express';
import {}from 'body-parser';
import {isLoggedIn} from '../middlewares/auth';
import models from '../models';

/* eslint new-cap: 0 */
const router = express.Router();
const csrfProtection = csrf({cookie: true});

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.render('index.nunj', {user: req.user});
});

router.get('/search',
  // isLoggedIn,
  csrfProtection,
  (req, res, next) => {
    /* eslint-enable no-unused-vars */
    models.pokemon
      .findAll()
      .then(pokemons=> {
        res.render('search.nunj', {
          user: req.user,
          pokemons: pokemons,
          csrfToken: req.csrfToken()
        });
      });
  });

router.post('/search',
// isLoggedIn,
  csrfProtection,
  (req, res, next)=> {
    res.send({
      count: 1
    });
  }
);

router.get('/report',
  isLoggedIn,
  csrfProtection,
  (req, res, next) => {
    /* eslint-enable no-unused-vars */
    models.pokemon
      .findAll()
      .then(pokemons=> {
        res.render('report.nunj', {
          user: req.user,
          pokemons: pokemons,
          csrfToken: req.csrfToken()
        });
      });

  });

function updateRating(coordinate, pokemonId, cb) {
  models.rating.findOrCreate({
    where: {
      coordinateId: coordinate.id,
      pokemonId: pokemonId
    }
  }).then(result=> {
    let rating = result[0];
    rating.update({
      caught: rating.caught + 1
    }).then(rating=> {
      cb();
    });
  });
}

function updateCoordinate(coordinate, cb) {
  coordinate.update({
    totalCaught: coordinate.totalCaught + 1
  }).then(coordinate=> {
    cb();
  });
}

router.post('/report',
  isLoggedIn,
  csrfProtection,
  (req, res, next)=> {
    let x = req.body['x'],
      y = req.body['y'],
      pokemonId = req.body['pokemonId'];

    models.coordinate.findOrCreate({
      where: {
        x: x,
        y: y
      }
    }).then(result=> {
      let coordinate = result[0];

      async.parallel([
        cb=> {
          updateRating(coordinate, pokemonId, cb);
        },
        cb=> {
          updateCoordinate(coordinate, cb);
        }
      ], (err, result)=> {
        res.send({
          success: !!!err
        });
      });
    });
  });

export default router;

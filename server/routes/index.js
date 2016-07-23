import async from 'async';
import util from 'util';
import csrf from 'csurf';
import express from 'express';
import {}from 'body-parser';
import {isLoggedIn} from '../middlewares/auth';
import models from '../models';

/* eslint new-cap: 0 */
const router = express.Router();
const csrfProtection = csrf({cookie: true});

const RESULT_LIMIT = 3;

/* GET home page. */
/* eslint-disable no-unused-vars */
router.get('/', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  res.render('index.nunj', {user: req.user});
});

router.get('/search',
  isLoggedIn,
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
  isLoggedIn,
  csrfProtection,
  (req, res, next)=> {
    req.checkBody('pokemonId', 'Invalid pokemonId').notEmpty().isInt();
    req.checkBody('bottomLeftX', 'Invalid bottomLeftX').notEmpty().isDecimal();
    req.checkBody('bottomLeftY', 'Invalid bottomLeftY').notEmpty().isDecimal();
    req.checkBody('topRightX', 'Invalid topRightX').notEmpty().isDecimal();
    req.checkBody('topRightY', 'Invalid topRightY').notEmpty().isDecimal();

    var errors = req.validationErrors();
    if (errors) {
      res.send('There have been validation errors: ' + util.inspect(errors), 400);
      return;
    }

    var pokemonId = req.body.pokemonId,
      bottomLeftX = req.body.bottomLeftX,
      bottomLeftY = req.body.bottomLeftY,
      topRightX = req.body.topRightX,
      topRightY = req.body.topRightY;

    models.sequelize.query(
      `select c."x",c."y",c."totalCaught",round(r."caught"::numeric/c."totalCaught"::numeric,2) as percentage
from ratings as r
inner join coordinates as c
on r."coordinateId" = c.id
inner join pokemons as p
on r."pokemonId" = p."id"
where (c."x" > :bottomLeftX and c."x" < :topRightX) and
(c."y" > :bottomLeftY and c."y" < :topRightY) and
r."pokemonId" = :pokemonId
order by percentage desc
limit :limit`, {
        replacements: {
          bottomLeftX: bottomLeftX,
          topRightX: topRightX,
          bottomLeftY: bottomLeftY,
          topRightY: topRightY,
          pokemonId: pokemonId,
          limit: RESULT_LIMIT
        },
        type: models.sequelize.QueryTypes.SELECT
      }).then(results=> {
      res.send({
        data: results
      });
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

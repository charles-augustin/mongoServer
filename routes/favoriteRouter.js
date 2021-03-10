const express = require('express');
const bodyParser = require('body-parser');
const favRouter = express.Router();
const authenticate = require('../authenticate');

const cors = require('./cors');

const Favorites = require('../models/favorite');

favRouter.use(bodyParser.json());

favRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav) {
                    for (i = 0; i < req.body.length; i++) {
                        if (fav.dishes.indexOf(req.body[i]._id) === -1)
                            fav.dishes.push(req.body[i]._id);
                    }
                    fav.save()
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                }

                else {
                    Favorites.create({ "user": req.user._id, "dishes": req.body })
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndRemove({ user: req.user._id })
            .then((fav) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favRouter.route('/:dishID')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus = 200; })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (!fav) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ "exists": false, "favorites": fav });

                }
                else {
                    if (fav.dishes.indexOf(req.params.dishID === -1)) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ "exists": false, "favorites": fav });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ "exists": true, "favorites": fav });
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav) {
                    if (fav.dishes.indexOf(req.params.dishID) === -1) {
                        fav.dishes.push(req.params.dishID);
                        fav.save()
                            .then((fav) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(fav);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else {
                        var err = new Error("Duplicate Dish Id's cannot be added to favorites");
                        err.status = 403;
                        return next(err);
                    }
                }
                else {
                    Favorites.create({ user: req.user._id, dishes: [req.params.dishID] })
                        .then((fav) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(fav);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((fav) => {
                if (fav) {
                    if (fav.dishes.indexOf(req.params.dishID) !== -1) {
                        fav.dishes.remove(req.params.dishID);
                        fav.save()
                            .then((fav) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(fav);
                            })
                    }
                    else {
                        var err = new Error('Dish is not found');
                        err.status = 403;
                        return next(err);
                    }
                }
                else {
                    var err = new Error('There is no fav dishes available for user to delete');
                    err.status = 403;
                    return next(err);
                }
            })
    })

module.exports = favRouter;
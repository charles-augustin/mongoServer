const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const cors = require('./cors');

promotionRouter.route('/')
    // .all((req,res,next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type','text/plain');
    //     next();
    // })
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus= 200; })
    .get(cors.cors, (req,res,next) => {
        // res.end('Will the send the details of promotions to you');
        Promotions.find(req.query)
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promotions);
            },(err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        // res.end('Will add the promotion ' + req.body.name + ' with details '
        //     +req.body.desc);
        Promotions.create(req.body)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promo);
            },(err) => next(err))
            .catch((err) => next(err))
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        res.end('PUT operation not supported on /promotions');
        res.statusCode = 403;
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        // res.end('Deleting the promotions');
        Promotions.remove({})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promo);
            },(err) => next(err))
            .catch((err) => next(err))
    });

promotionRouter.route('/:promotionID')
    // .all((req,res,next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type','text/plain');
    //     next();
    // })
    .options(cors.corsWithOptions, (req, res) => {res.sendStatus= 200; })
    .get(cors.cors, (req,res,next) => {
        // res.end("Will send the details of promotion: "+req.params.promotionID+ " to you!");
        Promotions.findById(req.params.promotionID)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promotion);
            },(err) => next(err))
            .catch((err) => next(err));
    })

    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        res.end('POST operation not supported in /promotions/promotionID');
        res.statusCode = 403;
    })

    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        // res.write('Updating the promotion:' + req.params.promotionID+'\n');
        // res.end('Will update the promotion '+req.body.name+ ' with details '+ req.body.desc);
        Promotions.findByIdAndUpdate(req.params.promotionID,
            { $set: req.body}, 
            {new: true})
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(promotion);
            },(err) => next(err))
            .catch((err) => next(err));
    })

    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
        // res.end('Deleted the promotion: '+ req.params.promotionID);
        Promotions.findByIdAndRemove(req.params.promotionID)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(resp);
            },(err) => next(err))
            .catch((err) => next(err));
    });

module.exports = promotionRouter;
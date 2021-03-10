const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

const Leaders = require('../models/leaders');

const authenticate = require('../authenticate');
const cors = require('./cors');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
// .all((req, res, next) => {
//     res.setHeader('Content-Type','text/plain');
//     res.statusCode=200;
//     next();
// })
.options(cors.corsWithOptions, (req, res) => {res.sendStatus= 200; })
.get(cors.cors, (req, res, next) => {
    // res.end('Will send the details of leaders to you');
    Leaders.find(req.query)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('PUT operation not supported in ' + req.baseUrl);
    res.statusCode=403;
})
.post(cors.corsWithOptions, cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.end('Will add the leader: '+ req.body.name+ ' with details: '
    //     +req.body.desc);
    Leaders.create(req.body)
        .then((resp) => {
            console.log('Leader Created: '+resp);
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(resp);
        },(err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.end('Deleting the leader details');
    Leaders.remove({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leaders);
        },(err) => next(err))
        .catch((err) => next(err));
});

leaderRouter.route('/:leaderID')
// .all((req, res, next) => {
//     res.setHeader('Content-Type','text/plain');
//     res.statusCode=200;
//     next();
// })
.options(cors.corsWithOptions, (req, res) => {res.sendStatus= 200; })
.get(cors.cors, (req, res, next) => {
    // res.end('Will send the details of leader: '+req.params.leaderID+' to you');
    Leaders.findById(req.params.leaderID)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(leader);
        },(err) => next(err))
        .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.write('Updating the leader '+ req.params.leaderID);
    // res.write('\n');
    // res.end('Will update the leader '+req.body.name +' details of leader '+req.body.desc);
    Leaders.findByIdAndUpdate(req.params.leaderID,{
        $set: req.body
    },{
        new: true
    })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.end('Post operation not supported in '+req.baseUrl + req.path);
    res.statusCode=403;
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    // res.end('Deleting the leader details: '+ req.params.leaderID);
    Leaders.findByIdAndRemove(req.params.leaderID)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports=leaderRouter;
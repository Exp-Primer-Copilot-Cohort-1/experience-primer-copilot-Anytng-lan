// Create web server

// Import express
var express = require('express');
var router = express.Router();

// Import comment model
var Comment = require('../models/comment');
var mongoose = require('mongoose');

// Import passport
var passport = require('passport');

// Import user model
var User = require('../models/user');

// Import authentication
var authenticate = require('../authenticate');

// Set up router
router.use(express.json());

// Set up GET request for comments
router.route('/')
    .get((req, res, next) => {
        // Find all comments
        Comment.find({})
            .populate('author')
            .then((comments) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comments);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Set up POST request for comments
    .post(authenticate.verifyUser, (req, res, next) => {
        // If comment exists, add it to the comment array
        if (req.body != null) {
            req.body.author = req.user._id;
            Comment.create(req.body)
                .then((comment) => {
                    Comment.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(comment);
                        })
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            err = new Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }
    })

    // Set up PUT request for comments
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /comments');
    })

    // Set up DELETE request for comments
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        // Delete all comments
        Comment.deleteMany({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// Set up GET request for comments by comment id
router.route('/:commentId')
    .get((req, res, next) => {
        // Find comment by id
        Comment.findById(req.params.commentId)
            .populate('author')
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Set up POST request for comments by comment id
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /comments/' + req.params.commentId);
    })

    // Set up PUT request for comments by comment id
    .put(authenticate.verifyUser, (req, res, next) => {
        // Find comment by id
        Comment.findById(req.params.commentId)
            .then((comment) => {
                // If comment exists, check if user is the author
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to update this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    // Update comment
                    req.body.author = req.user._id;
                    Comment.findByIdAndUpdate(req.params.commentId, {
                        $set: req.body
                    }, {
                        new: true
                    })
                        .then((comment) => {
                            Comment.findById(comment._id)
                                .populate('author')
                                .then((comment) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(comment);
                                })
                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    // Set up DELETE request for comments by comment id
    .delete(authenticate.verifyUser, (req, res, next) => {
        // Find comment by id
        Comment.findById(req.params.commentId)
            .then((comment) => {
                // If comment exists, check if user is the author
                if (comment != null) {
                    if (!comment.author.equals(req.user._id)) {
                        var err = new Error('You are not authorized to delete this comment!');
                        err.status = 403;
                        return next(err);
                    }
                    // Delete comment
                    Comment.findByIdAndDelete(req.params.commentId)
                        .then((response) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(response);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                } else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
            .catch((err) => next(err));
    })

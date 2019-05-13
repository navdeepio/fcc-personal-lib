/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const MONGODB_CONNECTION_STRING = process.env.DB;
const mongoose = require('mongoose');
const Book = require('../Book');

mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true });

module.exports = function (app) {
  app.route('/api/books')
    .get(function (req, res, next){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, results) {
        if (err) next(err);
        const filtered = [];
        results.forEach(result => {
          filtered.push({commentcount: result.comments.length,
                        title: result.title,
                        comments: result.comments,
                        _id: result._id});
        });
        return res.json(filtered);
      });
    })
    .post(function (req, res, next){
      const { title } = req.body;
      if (title) {
        let book = new Book({ title, comments: [] });
        book.save((err, data) => {
          if (err) next(err);
          return res.json(data);
        });
      } else {
        res.status(400).json({ message: 'no title provided' });
      }
    })
    .delete((req, res, next) => {
      Book.deleteMany({}, (err, data) => {
        if (err) next(err);
        res.json({ message: 'complete delete successful' });
      });
    });


  app.route('/api/books/:id')
    .get(function (req, res, next){
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'no book exists' });
      }
      Book.findById(id, (err, data) => {
        if (err) return next(err);
        if (!data) {
          return res.status(400).json({ message: 'missing book id' });
        }
        res.json(data);
      });
    })
    .post(function(req, res, next){
      const { id } = req.params;
      const { comment } = req.body;
      if (!id) {
        return res.status(400).json({ message: 'no book exists' });
      } else if (comment === '') {
        return res.status(400).json({ message: 'empty comment string' });
      }
      Book.findById(id, function (err, data) {
        if (err) next(err);
        if (!data) {
          return res.json({ message: 'no book exists' });
        }
        data.comments.push({content: comment});
        data.save(function(err, result) {
          if (err) throw err;
          res.json(result);
        })
      })
    })
    .delete(function(req, res, next){
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'missing book id' });
      }
      Book.findByIdAndDelete(id, function (err, res) {
        if (err) next(err);
        if (!res) {
          return res.status(400).json({ message: 'no book exists' });
        }
        res.json({ message: 'delete successful' });
      })
    });
  
};

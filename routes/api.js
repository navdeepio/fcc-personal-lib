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
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, results) {
        if (err) return res.status(500).json({ message: 'internal server error' });
        const filtered = results.reduce((prev, cur) => {
          let tmp = cur;
          const commentcount = curr.comments.length;
          delete tmp.comments;
          tmp['commentcount'] = commentcount;
          return [...prev, tmp];
        }, [] );
        return res.json(filtered);
      });
    })
    .post(function (req, res){
      const { title } = req.body;
      if (title !== '') {
        let book = new Book({ title });
        book.save((err, data) => {
          if (err) return res.status(500).json({ message: 'internal server error' });
          return res.json(data);
        });
      } else {
        return res.status(400).json({ message: 'no title provided' });
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });


  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};

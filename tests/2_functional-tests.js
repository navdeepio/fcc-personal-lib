/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const mongoose = require('mongoose');
chai.use(chaiHttp);


  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'Dubliners' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.equal(res.body.title, 'Dubliners');
            assert.property(res.body, '_id');
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.message, 'no title provided');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], '_id');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/'+ mongoose.Types.ObjectId())
          .end(function (err, res) {
            assert.equal(res.status, 400);
            assert.equal(res.body.message, 'missing book id');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const id = '5cd9359ebdca270f5efc9ae1';
        chai.request(server)
          .get(`/api/books/${id}`)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = 'new comment';
        const id = '5cd93672689a8e0fdf63f170';
        chai.request(server)
          .post(`/api/books/${id}`)
          .send({ comment })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[res.body.comments.length - 1].content, comment);
            done();
          });
      });
      
    });

  });

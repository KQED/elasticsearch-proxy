var expect = require('chai').expect,
    wordpressRadioHandler = require('../server/handlers/wordpressRadioHandler'),
    express = require('express'),
    request = require('supertest'),
    app = express();

app.get('/radio/keywords', wordpressRadioHandler.keywords);
app.get('/radio/programs', wordpressRadioHandler.programs);
app.get('/radio/dates', wordpressRadioHandler.dates);

describe('wordpressRadioHandler', function(){

  describe('wordpressRadioHandler.keywords', function(){

    it('should reject a GET request with a proper query string', function(done){

      request(app)
        .get('/radio/keywords')
        .expect(401, done);

    });

  });

  describe('wordpressRadioHandler.programs', function(){

    it('should reject a GET request with a proper query string', function(done){

      request(app)
        .get('/radio/programs')
        .expect(401, done);

    });

  });

  describe('wordpressRadioHandler.dates', function(){

    it('should reject a GET request with a proper query string', function(done){

      request(app)
        .get('/radio/dates')
        .expect(401, done);

    });

  });

});

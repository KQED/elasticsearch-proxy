var expect = require('chai').expect,
    filterMiddleware = require('../server/utils/filterMiddleware'),
    express = require('express'),
    request = require('supertest'),
    app = express();

app.post('/radio/posts', filterMiddleware.ipFilter, function(req, res){
  res.send('Successfully posted');
});

describe('filterMiddleware', function(){
/*
  it('should reject a POST request with an unauthorized ip', function(done){

    request(app)
      .post('/radio/posts')
      .set('x-forwarded-for', '111.11.11.11')
      .expect(401, done);

  });
  */

  it('should accept a POST request with an authorized ip', function(done){

    request(app)
      .post('/radio/posts')
      .set('x-forwarded-for', '111.11.11.12')
      .expect(200, done);

  });

});

var expect = require('chai').expect,
    requestUtil = require('../server/utils/requestUtil'),
    request = require('supertest'),
    express = require('express'),
    app = express(),
    nock = require('nock');

var searchEntries = {
  hits: {
    hits: [{'_source':{'id': 1, 'testEntry1': 'testEntry1'}}, {'_source':{'id': 2, 'testEntry2': 'testEntry2'}}]
  }
};

var elasticServer = nock(process.env.ELASTIC)
                      .post(process.env.RADIO_ENDPOINT)
                      .reply(200, searchEntries)
                      .post(process.env.RADIO_ENTRY)
                      .reply(200);

app.get('/radio/test', function(req, res){
  requestUtil.getElasticsearch({'searchQuery': 'search'}, process.env.RADIO_ENDPOINT, res); 
});

app.post('/radio/posts', function(req, res){
  requestUtil.handleElasticEntries({'testEntry3': 'testEntry3'}, process.env.RADIO_ENTRY, 'POST', res); 
});

describe('requestUtil', function(){
  
  describe('requestUtil.getElasticsearch', function(){
  
    it('should return elasticsearch results when given a query and endpoint', function(done){
      
      request(app)
        .get('/radio/test')
        .expect(200, [{ testEntry1: 'testEntry1' }, { testEntry2: 'testEntry2' }], done);
     
    });

    it('should return a 201 status code when the document is successfully updated/inserted/deleted', function(done){
    
    request(app)
      .post('/radio/posts')
      .expect(201, 'Document successfully handled', done);

    });
  
  });

});

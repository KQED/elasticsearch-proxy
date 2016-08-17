var config = require('./config'),
    log = require('../logging/bunyan');

module.exports = {

  ipFilter: function(req, res, next) {
    //get the origin ip address
    var ip = req.headers['x-forwarded-for'].split(',')[0];

    //if ip is found in our array of allowed ips, go to the next handler
    if(config.ips.indexOf(ip) > -1) {
        
        log.info('accepted request from server with an IP of ' + req.headers['x-forwarded-for']);

        next();
    
    } else {  
        
        log.info('rejected request from server with an IP of ' + req.headers['x-forwarded-for']);
        //otherwise, return an error
        res.status(401).send('Unauthorized');
    
    }

  },
  
  postFilter: function(req, res, next) {
    var link = req.body.link;
    var shouldBeIndexed = false;

    for(var key in config.siteIds) {
        if(config.siteIds[key] == req.body.site_id) {
            shouldBeIndexed = true;
        }
    }
    
    //Prevent posts from staging and sites not indexed to be added to elasticsearch
    if(link.match('ww2.staging.wpengine') === null && shouldBeIndexed) {
        log.info('Entry is proper type, will be indexed');
        
        next();
    
    } else {

       log.info('Entry is from staging or post should not be indexed');

       res.status(200).send('Cannot add entry, invalid type'); 
    
    }
  },
  electionsFilter: function(req, res, next) {
    req.elections = true;
    next();
  }

};

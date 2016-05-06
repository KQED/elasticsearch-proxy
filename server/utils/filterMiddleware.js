var ips = require('./config').ips,
    log = require('../logging/bunyan');

module.exports = {

  ipFilter: function(req, res, next) {

    //if ip is found in our array of allowed ips, go to the next handler
    if(ips.indexOf(req.headers['x-forwarded-for']) > -1) {
        
        log.info('accepted request from server with an IP of ' + req.headers['x-forwarded-for']);

        next();
    
    } else {  
        
        log.info('rejected request from server with an IP of ' + req.headers['x-forwarded-for']);
        //otherwise, return an error
        res.status(401).send('Unauthorized');
    
    }

  }

};

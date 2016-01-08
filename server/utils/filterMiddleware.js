var ips = require('./config').ips;

module.exports = {

  ipFilter: function(req, res, next) {

    //if ip is found in our array of allowed ips, go to the next handler
    if(ips.indexOf(req.headers['x-forwarded-for']) > -1) {
    
        next();
    
    } else {  
      
        //otherwise, return an error
        res.status(401).send('Unauthorized');
    
    }

  }

};

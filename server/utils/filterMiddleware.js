module.exports = {
  ips : ['204.48.60.41'],
  ipFilter: function(req, res, next) {
  
    if(module.exports.ips.indexOf(req.headers['x-forwarded-for']) > -1) {
    
        next();
    
    } else {  
    
        res.status(401).send('Unauthorized');
    
    }

  }

};

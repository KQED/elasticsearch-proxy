module.exports = {
  
  authCheck: function(req, res, next) {
    if(req.query.key !== process.env.AUTH_KEY) {
      res.status(401).send('Unauthorized request');
    } else {
      next();
    }
  }

};

module.exports = {
  
  queryCheck: function(req, res, next) {
    if(!req.query.keywords && !req.query.program && !req.query.startDate) {
      res.status(400).send('Invalid request.');
    } else {
      next();
    }
  }

};

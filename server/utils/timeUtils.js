module.exports = {
  getUnixTimestamp: function(date, dateType) {
    var unixDate = new Date(date);
    
    if(dateType === 'end') {
      unixDate.setUTCHours(24,0,0,0);
      return Math.floor(unixDate.getTime() / 1000);      
    }
    
    unixDate.setUTCHours(0,0,0,0);
    return Math.floor(unixDate.getTime() / 1000);     
  }
};

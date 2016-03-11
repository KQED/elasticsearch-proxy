module.exports = {

  ips: [process.env.IP1, process.env.IP2],

  //object that holds ids of wordpress multisite
   siteIds: {

    perspectives: '44',
    news: '',
    forum: '43'

  },
  siteEndpoints: {
    perspectives: '/wp/perspectives/',
    forum: '/wp/forum/'
  }

};

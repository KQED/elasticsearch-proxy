module.exports = {

  ips: [process.env.IP1, process.env.IP2, process.env.IP3, process.env.IP4],

  //object that holds ids of wordpress multisite
   siteIds: {
    perspectives: '44',
    forum: '43'

  },
  siteEndpoints: {
    perspectives: process.env.INDEX + 'perspectives/',
    forum: process.env.INDEX +  'forum/'
  },
  hashKey:'wlk!358u1h'

};

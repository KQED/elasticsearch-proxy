module.exports = {

  ips: [process.env.IP1, process.env.IP2, process.env.IP3, process.env.IP4],

  //object that holds ids of wordpress multisite
   siteIds: {
    arts: '2',
    artschool: '4',
    events: '7',
    news: '10',
    pop: '12',
    futureofyou: '13',
    jpepin: '14',
    about: '19',
    mindshift: '23',
    bayareabites: '24',
    support: '25',
    lowdown: '26',
    stateofhealth: '27',
    spark: '28',
    trulyca: '29',
    imagemakers: '30',
    science: '35',
    quest: '39',
    checkplease: '40',
    food: '41',
    forum: '43',
    perspectives: '44'
  },
  siteEndpoints: {
    about: process.env.INDEX + 'about/',
    arts: process.env.INDEX + 'arts/',
    artschool: process.env.INDEX + 'artschool/',
    bayareabites: process.env.INDEX + 'bayareabites/',
    checkplease: process.env.INDEX + 'checkplease/',
    food: process.env.INDEX + 'food/',
    forum: process.env.INDEX +  'forum/',
    futureofyou: process.env.INDEX +  'futureofyou/',
    imagemakers: process.env.INDEX +  'imagemakers/',
    jpepin: process.env.INDEX +  'jpepin/',
    lowdown: process.env.INDEX +  'lowdown/',
    mindshift: process.env.INDEX +  'mindshift/',
    news: process.env.INDEX +  'news/',
    perspectives: process.env.INDEX + 'perspectives/',
    pop: process.env.INDEX +  'pop/',
    quest: process.env.INDEX +  'quest/',
    science: process.env.INDEX +  'science/',
    spark: process.env.INDEX +  'spark/',
    stateofhealth: process.env.INDEX +  'stateofhealth/',
    support: process.env.INDEX +  'support/',
    trulyca: process.env.INDEX +  'trulyca/'
  }

};

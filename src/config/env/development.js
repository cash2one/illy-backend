'use strict';

module.exports = {
  app: {
    title: 'illy-dev'
  },
  db: {
    uri: 'mongodb://localhost:27017/mean-dev',
    options: {}
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
    options: {}
  },
  log: {
    format: 'dev',
    options: {}
  },
  jwt: {
    secret: 'lovekuando',
    key: 'jwtUser',
    debug: true
  },
  weixin: {
    appid: 'wx41ce4973af7f252a',
    secret: '3997d1c0d7742cf112e8fc6523efd78c'
  },
  qn: {
    accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
    secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
    bucket: 'yirgacheffe',
    visitUrl: 'resource.hizuoye.com'
  },
  docUrl: ''

};

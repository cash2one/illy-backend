'use strict';

module.exports = {
    app: {
        title: 'illy-production'
    },
    db: {
        uri: 'mongodb://10.165.69.183/yirgacheff,10.162.219.31,10.171.82.99',
        options: {
            db: {native_parser: true},
            replset: {
                rs_name: 'rs1',
                poolSize: 10,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            server: {
                poolSize: 5,
                socketOptions: {
                    keepAlive: 1,
                    connectTimeoutMS: 30000
                }
            },
            user: 'yirgacheffDBAdmin',
            pass: 'dk12345!@#$%'
        }
    },
    redis: {
        host: 'a97582a7d76211e4.m.cnbja.kvstore.aliyuncs.com',
        port: 6379,
        options: {
            auth_pass: 'a97582a7d76211e4:Mooc1988'
        }
    },
    log: {
        format: 'combined',
        options: {
            stream: 'access.log'
        }
    },

    jwt: {
        secret: 'lovekuando',
        key: 'jwtUser'
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

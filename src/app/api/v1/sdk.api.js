/**
 * Created by Frank on 15/7/6.
 */
'use strict';
var _ = require('lodash');
var sign = require('../../weixin/sdk/sign');


var sdkApi = {
    /**
     * 获取签名
     */
    getSign: function*() {
        var ticket = this.request.ticket;
        var url = this.request.query.url;
        if (!url) {
            this.throw(400);
        }
        this.body = sign(ticket, url);
    },

    /**
     * 生成二维码图片
     */
    generateBinary: function *() {
        var data = this.request.query;
        var role = data.role, scene = data.scene;
        if (!role || !scene) {
            this.throw(400, 'role or scene not found');
        }
        scene = parseInt(scene);
        if (_.isNaN(scene)) {
            this.throw(400, 'sence must be number');
        }
        var postData = {
            action_info: {
                scene: {
                    scene_id: scene
                }
            }
        };
        if (role === 'school') {
            postData.action_name = 'QR_LIMIT_SCENE';
        } else if (role === 'student') {
            postData.action_name = 'QR_SCENE';
            postData.expire_second = 604800; //七天过期时间
        } else {
            this.throw(400);
        }
        var res = yield weixin.getQrcode(postData);
        if (res.errcode) {
            this.throw(400, res.errmsg);
        }
        this.body = res;
    }

};

module.exports = sdkApi;

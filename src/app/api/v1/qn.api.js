/**
 * Created by Frank on 15/7/24.
 */

'use strict';
var QnGarbage = require('../../models').QnGarbage;

var qnApi = {

    /**
     * qn format convert callback
     */
    persistentNotify: function*() {
        var data = this.request.body;
        var code = data.code;
        var key = data.inputKey;
        //说明转码成功
        if (code === 0) {
            try {
                yield QnGarbage.create({
                    key: key
                });
                console.log('save success');
            } catch (err) {
                console.error('resource [' + key + '] format failed : ', err);
            }
        } else {
            console.error(data.error);
        }
    }
};


module.exports = qnApi;


/**
 *
 * Created by Frank on 15/7/6.
 */

var qrcode = require('../../api/v1/qrcode.api');
module.exports = function (api) {
    api.get('/public/sdk/generateBinary', qrcode.generateBinary);
};

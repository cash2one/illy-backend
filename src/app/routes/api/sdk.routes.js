/**
 *
 * Created by Frank on 15/7/6.
 */

var sdk = require('../../api/v1/sdk.api'),
    auth = require('../../middleware/auth');
module.exports = function (api) {
    /**
     * @api {get} /api/v1/public/sdk/signature sdk页面签名
     * @apiName  GetWEIXINSign
     * @apiGroup WEIXIN
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiParam {String} url 需要签名的url
     * @apiUse ClientRequestError
     * @apiSuccess {String} nonceStr 签名随机串
     * @apiSuccess {String} timestamp 时间戳
     * @apiSuccess {String} signature 签名
     * @apiSuccess {String} appid appid
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *  {
   *   "nonceStr": "xxx",
   *   "timestamp": "xxx",
   *   "signature": "xxx",
   *   "appid": "xxx"
   *  }
     *
     */
    api.get('/public/sdk/signature', sdk.getSign);

    api.get('/public/sdk/generateBinary', sdk.generateBinary);
};

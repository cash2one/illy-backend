/**
 *
 * Created by Frank on 15/7/3.
 */

var parser = require('./xmlParser'),
  eventHandler = require('./event'),
  msgHandler = require('./msg');

/**
 * 处理微信信息接口
 * @returns {Function}
 */
module.exports = function () {
  var regx = new RegExp('^/msg');
  return function*(next) {
    var url = this.url;
    if (!regx.test(url)) {
      yield next;
    } else {
      var msg = this.request.xml;
      if (!msg) {
        console.error('Receive unresolved message from : ', url);
        this.body = '';
        return;
      }
      // 处理事件类型消息
      if (msg.MsgType === 'event') {
        this.body = yield eventHandler(msg);
      }
      // 处理普通类型消息
      else {
        this.body = yield msgHandler(msg);
      }
    }
  };
};

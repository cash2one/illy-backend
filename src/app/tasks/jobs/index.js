/**
 * Created by Frank on 15/7/7.
 */


module.exports = function (queue) {

  require('./qn')(queue);
  require('./weixinEvent')(queue);

};

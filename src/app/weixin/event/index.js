/**
 * Created by Frank on 15/7/6.
 */
'use strict';
var co = require('co');
var _ = require('lodash');
var requireDir = require('require-dir');
var handlerMap = new Map();


function registerHandler(handlerModule) {
    for (var handlerName in handlerModule) {
        if (handlerModule.hasOwnProperty(handlerName)) {
            handlerMap.set(handlerName.toUpperCase(), handlerModule[handlerName]);
        }
    }
}

_.forEach(requireDir('./handlers'), function (handlerModule) {

    registerHandler(handlerModule);
});


/**
 *
 * 如果没有注册事件处理，使用该处理
 *
 */
var dummy = co.wrap(function*() {
    return '';
});


module.exports = function (msg) {
    var event = msg.Event.toUpperCase();
    var handler = handlerMap.get(event) || dummy;
    return handler(msg);
};

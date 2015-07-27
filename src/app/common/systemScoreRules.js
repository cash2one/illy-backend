/**
 * Created by Frank on 15/5/11.
 */
'use strict';
var keys = require('./constants').scoreRules,
  systemRules = {};

systemRules[keys.FINISH_HOMEWORK_AWARD] = {
  key: keys.FINISH_HOMEWORK_AWARD,
  description: '完成作业奖励',
  value: 5,
  op: 0
};

systemRules[keys.FINISH_PREVIEW_AWARD] = {
  key: keys.FINISH_PREVIEW_AWARD,
  description: '完成预习奖励',
  value: 5,
  op: 0
};

systemRules[keys.FULL_SCORE_AWARD] = {
  key: keys.FULL_SCORE_AWARD,
  description: '作业满分奖励',
  value: 5,
  op: 0
};

//systemRules[keys.SHARE_AWARD] = {
//    key: keys.SHARE_AWARD,
//    description: '分享奖励',
//    value: 5,
//    op: 0
//};
//systemRules[keys.TEST_INVITE_AWARD] = {
//    key: keys.TEST_INVITE_AWARD,
//    description: '测评邀请奖励',
//    value: 5,
//    op: 0
//};


module.exports = systemRules;


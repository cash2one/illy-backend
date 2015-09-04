/**
 * Created by Frank on 14/11/27.
 */
'use strict';

module.exports = {
    // 角色
    roles: {
        HEADMASTER: 0,
        TEACHER: 1,
        STUDENT: 2
    },

    // 常用状态
    states: {
        UNDO: 0,     // 未做
        DONE: 1      // 已完成
    },

    operations: {
        INCREASE: 0,
        DECREASE: 1
    }

};

/**
 * Created by Frank on 14/11/27.
 */


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
    },

    // 积分规则key  operation : 0 添加  1:减少
    scoreRules: {
        FINISH_HOMEWORK_AWARD: 0,
        FINISH_PREVIEW_AWARD: 1,
        FULL_SCORE_AWARD: 2,
        SHARE_AWARD: 3,
        TEST_INVITE_AWARD: 4
    }

};

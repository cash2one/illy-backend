/**
 * Created by Frank on 16/1/11.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

/**
 * 报名表单数据模型
 */
var enrollSchema = new mongoose.Schema({

    // 报名表单域 (姓名电话不包含在内,默认拥有)
    fields: [{
        inputType: {
            type: String,
            default: 'text'
        },
        label: String
    }],

    event: {
        type: ObjectId,
        ref: 'Event'
    },

    state: {
        type: Number,
        default: 0  // 0: 进行中  1: 已结束
    },

    enrollCount: {
        type: Number,
        default: 0
    },

    schoolId: {
        type: ObjectId,
        required: true
    }

});

//删除该报名后,对应的报名信息一并删除
enrollSchema.post('remove', (enroll)=> {
    mongoose.model('EnrollNames').remove({
        enroll: enroll._id
    }).exec();
});

mongoose.model('Enroll', enrollSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var classSchema = new Schema({

    // 班级名称
    className: {
        type: String,
        required: true,
        trim: true
    },

    // 班级拥有者
    owner: {
        type: ObjectId,
        required: true,
        index: 1,
        sparse: true,
        ref: 'Teacher'
    },

    ownerDisplayName: {
        type: String
    },

    ownerUsername: {
        type: String
    },

    // 状态
    state: {
        type: Number,
        enum: [0, 1],
        default: 0
    },

    // 创建时间
    createdTime: {
        type: Date,
        default: Date.now
    },

    // 学校id
    schoolId: {
        type: ObjectId,
        required: true,
        index: true
    }
});

classSchema.index({owner: 1}, {sparse: 1});
classSchema.index({schoolId: 1, state: 1});

module.exports = {
    Class: mongoose.model('Class', classSchema)
};

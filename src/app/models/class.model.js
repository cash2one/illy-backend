'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var classSchema = new Schema({
  // 班级名称
  className: {
    type: String,
    required: '班级名称不能为空',
    trim: true
  },
  // 班级拥有者
  owner: {
    type: ObjectId,
    required: '班级老师不能为空',
    ref: 'Teacher'
  },
  ownerDisplayName: {
    type: String
  },
  ownerUsername: {
    type: String
  },
  // 班级学生
  students: [{
    type: ObjectId,
    ref: 'Student',
    index: true
  }],
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
    type: ObjectId
  }
});

classSchema.index({schoolId: 1}, {owner: 1}, {state: 1});
module.exports = {
  Class: mongoose.model('Class', classSchema)
};

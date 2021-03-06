/**
 * Created by Frank on 15/7/2.
 */
'use strict';

var models = require('../../models');
var Category = models.Category;
var Post = models.Post;


var siteApi = {

    /**
     *
     * 列出当前分类
     *
     */
    listCategories: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        this.body = yield Category.find({schoolId: schoolId, disabled: 0}, 'name').lean().exec();
    },

    /**
     * 列出分类及对应文章列表
     */
    listCategoriesAndPosts: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var postsList = [];
        var ret = [];
        var categories = yield Category.find({schoolId: schoolId, disabled: 0}, 'name').lean().exec();
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            ret[i] = category;
            var promise = Post.find({category: category._id}, '-content')
                .lean()
                .limit(4)
                .sort('-createdTime')
                .exec();
            postsList.push(promise);
        }
        postsList = yield postsList;
        for (var j = 0; j < ret.length; j++) {
            ret[j].posts = postsList[j];
        }
        this.body = ret;
    },

    /**
     * 列出指定分类的文章列表
     */
    listPostsOfCategory: function *() {
        var offset = this.request.query.offset || 0;
        var limit = this.request.query.limit || 6;
        var posts = yield Post.find({category: this.params.categoryId})
            .select('-content')
            .lean()
            .skip(offset)
            .limit(limit)
            .exec();
        this.body = posts || [];
    },

    /**
     * 轮播文章列表
     */
    slidePosts: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var limit = this.request.query.limit || 5;
        var posts = yield Post.find({isSlide: 1, schoolId: schoolId})
            .select('-content')
            .limit(limit)
            .lean()
            .exec();
        this.body = posts || [];
    },


    /**
     * 热门文章列表
     */
    hotPosts: function *() {
        var jwtUser = this.state.jwtUser;
        var schoolId = jwtUser.schoolId;
        var limit = this.request.query.limit || 5;
        var posts = yield Post.find({schoolId: schoolId})
            .sort('-visitCount')
            .select('-content')
            .limit(limit)
            .lean()
            .exec();
        this.body = posts || [];
    },

    /**
     * 读取指定文章
     */
    readPost: function *() {
        var postId = this.params.postId;
        // 读取并更新访问数量
        this.body = yield Post.findByIdAndUpdate(postId, {$inc: {visitCount: 1}}, {new: true}).exec();
    },


    /**
     * 分享接口，用于更新
     */
    share: function *() {
        var postId = this.params.postId;
        this.body = yield Post.update({_id: postId}, {$inc: {shareCount: 1}}).exec();
    },


    /**
     * 点赞
     */
    like: function *() {
        var postId = this.params.postId;
        this.body = yield Post.update({_id: postId}, {$inc: {like: 1}}).exec();
    }

};


module.exports = siteApi;

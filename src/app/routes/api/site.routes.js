/**
 * Created by Frank on 15/7/8.
 */
'use strict';
var site = require('../../api/v1/site.api');

module.exports = function (api) {
    /**
     *
     * @api {get} /api/v1/categories 分类列表
     * @apiName ListCategories
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiHeader {String} Authorization Json web token
     * @apiSuccess {Object[]} response
     * @apiSuccess {String} response.name 分类名称
     * @apiSuccess {String} response._id 分类ID
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     [
     *       { name : 'xxx',
     *         _id : 'xxx'
     *       },
     *
     *       { name: 'xxx',
     *          _id:'xxx'
     *        }
     *      ]
     *
     */
    api.get('/categories', site.listCategories);


    /**
     *
     * @api {get} /api/v1/categories/posts 分类列表及文章列表
     * @apiName CategoriesAndPosts
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiHeader {String} Authorization Json web token
     * @apiSuccess {Object[]} response
     * @apiSuccess {Object} response.category 分类信息
     * @apiSuccess {String} response.category.name 分类名称
     * @apiSuccess {String} response.category._id 分类ID
     * @apiSuccess {Object[]} response.posts 文章列表
     * @apiSuccess {String} response.posts 文章列表
     * @apiSuccess {String} response.posts.title 文章标题
     * @apiSuccess {String} response.posts.image 文章图片
     * @apiSuccess {String} response.posts._id 文章ID
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *    [ {
   *        category :{
   *            name: xxxx,
   *            _id : xxx,
   *        },
   *        posts :[{
   *            title: xxx,
   *            image: xxx,
   *            _id : xxx
   *        },
   *        {
   *            title: xxx,
   *            image: xxx,
   *            _id : xxx
   *        }]
   *     },
     *     {
   *        category :{
   *            name: xxxx,
   *            _id : xxx,
   *        },
   *        posts :[{
   *            title: xxx,
   *            image: xxx,
   *            _id : xxx
   *        }]
   *     }]
     *
     */
    api.get('/categories/posts', site.listCategoriesAndPosts);


    /**
     * @api {get} /api/v1/categories/:categoryId/posts 指定分类文章列表
     * @apiName PostsOfCategory
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiHeader {String} Authorization Json web token
     * @apiParam {Number} offset=0  偏移
     * @apiParam {Number} limit=6 数量
     * @apiSuccess {Object[]} response
     * @apiSuccess {String} response.title 文章标题
     * @apiSuccess {String} response.image 文章图片
     * @apiSuccess {String} response._id 文章ID
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *    [{
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     },
     *     {
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     }]
     *
     *
     */
    api.get('/categories/:categoryId([a-f0-9]{24})/posts', site.listPostsOfCategory);


    /**
     * @api {get} /api/v1/posts/slider 轮播列表
     * @apiName PostsOfSlider
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiHeader {String} Authorization Json web token
     * @apiSuccess {Object[]} response
     * @apiSuccess {String} response.title 标题
     * @apiSuccess {String} response.image 图片地址
     * @apiSuccess {String} response._id 文章ID
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *    [{
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     },
     *     {
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     }]
     */
    api.get('/posts/slider', site.slidePosts);


    /**
     * @api {get} /api/v1/posts/hot 热门文章
     * @apiName PostsOfHot
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission 认证用户
     * @apiHeader {String} Authorization Json web token
     * @apiParam {Number} limit=5 数量
     * @apiSuccess {Object[]} response
     * @apiSuccess {String} response.title 标题
     * @apiSuccess {String} response.image 图片地址
     * @apiSuccess {String} response._id 文章ID
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *    [{
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     },
     *     {
   *         title: xxx,
   *         image: xxx,
   *         _id : xxx
   *     }]
     */
    api.get('/posts/hot', site.hotPosts);


    /**
     * @api {get} /api/v1/public/posts/:postId 文章详情
     * @apiName ReadPost
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     * @apiSuccess {String} title 文章标题
     * @apiSuccess {String} content 文章内容
     * @apiSuccess {Date} created  发布时间
     * @apiSuccess {Number} shareCount 分享数量
     * @apiSuccess {Number} visitCount 访问量
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     {
     *       title        : xxx,
     *       content      : xxx,
     *       created      : xxx,
     *       shareCount   : xxx,
     *       visitCount   : xxx
     *     }
     *
     */


    api.get('/public/posts/:postId([a-f0-9]{24})', site.readPost);

    /**
     * @api {put} /api/v1/public/posts/:postId/share  更新分享数
     * @apiName UpdateShareCount
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     *
     */
    api.put('/public/posts/:postId([a-f0-9]{24})/share', site.share);


    /**
     * @api {put} /api/v1/public/posts/:postId/like 点赞
     * @apiName UpdateLike
     * @apiGroup Site
     * @apiVersion 0.0.1
     * @apiPermission public
     * @apiHeader {String} Authorization Json web token
     *
     */
    api.put('/public/posts/:postId([a-f0-9]{24})/like', site.like);



};

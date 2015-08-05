/**
 *
 * Created by Frank on 15/7/1.
 */
'use strict';
var score = require('../../api/v1/score.api');

/**
 *
 * 积分操作接口路由
 * @param api
 *
 */
module.exports = function (api) {


    /**
     *
     * @api {get} /api/v1/score/rank/topTen  积分榜top10
     * @apiName ScoreRankTop10
     * @apiGroup Score
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiSuccess {String} displayName 名字
     * @apiSuccess {String} avatar 头像
     * @apiSuccess {String} score 积分数
     * @apiSuccess {String} rank  排名
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     [{
   *       displayName: '郭靖',
   *       avatar: 'http://img.kuando.com/avatar.jpeg',
   *       score : 120,
   *       rank : 1
   *     },{
   *       displayName: '黄蓉',
   *       avatar: 'http://img.kuando.com/avatar.jpeg',
   *       score : 110,
   *       rank : 2
   *     }]
     *
     */
    api.get('/score/rank/topTen', score.scoreTopTen);


    /**
     *
     * @api {get} /api/v1/score/rank/me  用户积分及排名
     * @apiName ScoreRankOfMe
     * @apiGroup Score
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiSuccess {Number} score 积分
     * @apiSuccess {Number} rank  排名
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     {
   *       score : 120,
   *       rank : 100
   *     }
     *
     */
    api.get('/score/rank/me', score.scoreRank);


    /**
     *
     * @api {get} /api/v1/score/mall  积分商城
     * @apiName ScoreMall
     * @apiGroup Score
     * @apiVersion 0.0.1
     * @apiHeader {String} Authorization Json web token
     * @apiPermission 认证用户
     *
     * @apiParam {Number} limit=5 返回数据数量 (用于分页)
     * @apiParam {Number} offset=0 数据查询偏移数量 (用于分页)
     * @apiSuccess {Object[]} response 返回的response数据
     * @apiSuccess {String} response.productName 商品名称
     * @apiSuccess {String} response.imageKey 图片
     * @apiSuccess {Number} response.score  花费积分
     * @apiSuccess {Number} response.stock 库存
     * @apiSuccess {Number} response.exchangeTimes 兑换次数
     *
     * @apiSuccessExample 成功响应示例
     *     HTTP/1.1 200 OK
     *     [{
   *       productName : "书包",
   *       image : "http://img.hizuoye.com/bag.jpeg",
   *       score : 120,
   *       stock : 100,
   *       exchangeTimes : 100
   *     },
     *      { productName : "手表",
   *       image : "http://img.hizuoye.com/watch.jpeg",
   *       score : 120,
   *       stock : 100,
   *       exchangeTimes : 100
   *     }]
     *
     */
    api.get('/score/mall', score.scoreMall);


};

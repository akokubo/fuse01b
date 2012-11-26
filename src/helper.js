/**
 * ヘルパー
 *
 * @namespace FUSE01B
 * @class helper
 */
FUSE01B.helper = {
    /**
     * 指定した範囲の整数の乱数を生成
     *
     * @method randint
     * @param {Number} min 最小値
     * @param {Number} max 最大値
     * @return {Number} 乱数
     */
    randint: function (min, max) {
        'use strict';
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * 指定した範囲の小数の乱数を生成
     *
     * @method randfloat
     * @param {Number} min 最小値
     * @param {Number} max 最大値
     * @return {Number} 乱数
     */
    randfloat: function (min, max) {
        'use strict';
        return Math.random() * (max - min) + min;
    },

    /**
     * ラジアンを度に変換する
     *
     * @method degree
     * @param {Number} rad ラジアン
     * @return {Number} 度
     */
    degree: function (rad) {
        'use strict';
        return 360 * rad / 2 / Math.PI;
    },

    /**
     * 度をラジアンに変換する
     *
     * @method radian
     * @param {Number} degree 度
     * @return {Number} ラジアン
     */
    radian: function (degree) {
        'use strict';
        return 2 * Math.PI * degree / 360;
    }
};

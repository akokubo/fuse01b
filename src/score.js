/**
 * Scoreオブジェクトを作成
 * @class Score
 * @constructor
 * @namespace FUSE01B
 */
FUSE01B.Score = Class.create(Label, {
    initialize: function () {
        'use strict';
        // Labelオブジェクトの生成
        Label.call(this);

        this.value = 0;
        this.text = "SCORE: " + this.value;

        this.x = 10;
        this.y = 10;
        this.color = "white";
        this.font = "24px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
    },

    /**
     * 得点を追加
     *
     * @method add
     * @param {Number} value 追加する得点
     */
    add: function (value) {
        'use strict';
        this.value += value;
        this.text = "SCORE: " + this.value;
    }
});


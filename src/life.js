/**
 * Lifeオブジェクトを作成
 * @class Life
 * @constructor
 * @namespace FUSE01B
 */
FUSE01B.Life = Class.create(Label, {
    initialize: function () {
        'use strict';
        // Labelオブジェクトの生成
        Label.call(this);

        this.value = 3;
        this.text = "LIFE: " + this.value;

        this.x = 210;
        this.y = 10;
        this.color = "white";
        this.font = "24px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
    },

    /**
     * ライフを減らす
     *
     * @method decrement
     * @param {Number} value 追加する得点
     */
    decrement: function () {
        'use strict';
        this.value = this.value - 1;
        if (this.value === -1) {
            this.text = "LIFE: 0";
        } else {
            this.text = "LIFE: " + this.value;
        }
    }
});


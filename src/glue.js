/**
 * Glueオブジェクトを作成
 * @class Glune
 * @constructor
 * @namespace FUSE01B
 * @param {Number} x x成分
 * @param {Number} y y成分
 */
FUSE01B.Glue = Class.create(Sprite, {
    initialize: function () {
        'use strict';
        var width, height;
        width = FUSE01B.config.SCREEN_WIDTH;
        height = FUSE01B.config.SCREEN_HEIGHT;

        // 実は全画面を覆っているSprite。線をその中に描いているだけ
        Sprite.call(this, width, height);
        this.x = 0;
        this.y = 0;

        this.segment = new FUSE01B.Segment();

        this.surface = new Surface(width, height);

        this.surface.context.strokeStyle = "yellow";
        this.surface.context.lineWidth = 1;

        this.image = this.surface;
    },

    /**
     * フレーム毎の処理
     *
     * @method onenterframe
     */
    onenterframe: function () {
        'use strict';
        this.draw();
    },

    /**
     * 描画
     *
     * @method draw
     */
    draw: function () {
        'use strict';
        var width, height, context, end0, end1, length, power, nop;
        width = FUSE01B.config.SCREEN_WIDTH;
        height = FUSE01B.config.SCREEN_HEIGHT;
        context = this.surface.context;
        end0 = this.segment.end0;
        end1 = this.segment.end1;
        length = this.segment.length();

        power = function (length) {
            var value;
            if (length < 60) {
                value = 100;
            } else if (length < 120) {
                value = 80;
            } else if (length < 200) {
                value = 40;
            } else {
                value = 20;
            }
            return value / 100;
        };

        context.clearRect(0, 0, width, height);

        if (end0 === null) {
            nop = 1;
        } else if (end1 === null) {
            context.fillStyle = "orange";
            context.beginPath();
            context.arc(
                end0.position.x,
                end0.position.y,
                3,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
        } else {
            context.fillStyle = "orange";
            context.globalAlpha = power(length);
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(
                end0.position.x,
                end0.position.y
            );
            context.lineTo(
                end1.position.x,
                end1.position.y
            );
            context.closePath();
            context.stroke();

            context.globalAlpha = 1;
            context.beginPath();
            context.arc(
                end0.position.x,
                end0.position.y,
                3,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
            context.beginPath();
            context.arc(
                end1.position.x,
                end1.position.y,
                3,
                0,
                2 * Math.PI,
                false
            );
            context.fill();
        }
    },

    /**
     * 設定を初期化
     *
     * @method initialSetting
     */
    initialSetting: function () {
        'use strict';
        this.segment.setEnd0(null);
        this.segment.setEnd1(null);
    }
});

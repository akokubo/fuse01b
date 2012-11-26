/**
 * Ballオブジェクトを作成
 * @class Ball
 * @constructor
 * @namespace FUSE01B
 * @param {Number} x x成分
 * @param {Number} y y成分
 */
FUSE01B.Ball = Class.create(Sprite, {
    /**
     * オブジェクトの初期化
     *
     * @method initialize
     */
    initialize: function () {
        'use strict';
        var size　= FUSE01B.config.BALL_SIZE;

        // Spriteオブジェクトの生成
        Sprite.call(this, size, size);

        this.initialSetting();

        // 描画設定
        this.surface = new Surface(size, size);
        this.image = this.surface;

        this.draw();
    },

    /**
     * フレーム毎の処理
     *
     * @method onenterframe
     */
    onenterframe: function () {
        'use strict';
        var p, radius;
        p = this.point.position;
        radius = FUSE01B.config.BALL_SIZE / 2;

        // 移動処理
        this.resistance();
        this.point.move();
        this.x = p.x - radius;
        this.y = p.y - radius;

        // 描画
        this.draw();
    },

    /**
     * 描画
     *
     * @method draw
     */
    draw: function () {
        'use strict';
        var v, size, radius, power, context;
        v = this.point.velocity.length();
        size = FUSE01B.config.BALL_SIZE;
        radius = size / 2;

        power = function (v) {
            var ratio;
            ratio = v / 5 * 128 + 128;
            if (ratio > 255) {
                ratio = 255;
            }
            return ratio / 255;
        };

        context = this.surface.context;
        context.clearRect(0, 0, size, size);
        context.globalAlpha = power(v);
        context.fillStyle = "red";
        context.strokeStyle = "white";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(
            radius,
            radius,
            radius - 1,
            0,
            2 * Math.PI,
            false
        );
        context.fill();
        context.stroke();
    },

    /**
     * 初期設定
     *
     * @method initialSetting
     */
    initialSetting: function () {
        'use strict';
        var size, radius, offset, v, rad;
        size = FUSE01B.config.BALL_SIZE;
        radius = size / 2;

        // 初期位置の設定
        offset = FUSE01B.config.BALL_INITIAL_POSITION_OFFSET;
        this.point = new FUSE01B.Point(size + offset, size + offset);

        // Spriteの中心にボールの中心を設定する
        this.x = this.point.position.x - radius;
        this.y = this.point.position.y - radius;

        // 初速度の設定
        v = FUSE01B.helper.randfloat(
            FUSE01B.config.BALL_SPEED_MIN,
            FUSE01B.config.BALL_SPEED_MAX
        );
        rad = FUSE01B.helper.randfloat(0, 2 * Math.PI);

        this.point.velocity.x = v * Math.cos(rad);
        this.point.velocity.y = v * Math.sin(rad);
    },

    /**
     * 速度を増やす
     *
     * @method gainVelocity
     */
    gainVelocity: function (velocity) {
        'use strict';
        var v;
        v = this.point.velocity.length();
        this.point.velocity.setLength(v + velocity);
    },

    /**
     * 空気抵抗
     *
     * @method resistance
     */
    resistance: function () {
        'use strict';
        var v = this.point.velocity.length();
        this.point.velocity.setLength((1 - FUSE01B.config.AIR_REGISTANCE) * v);
    }
});


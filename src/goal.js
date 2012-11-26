/**
 * Goalオブジェクトを作成
 * @class Goal
 * @constructor
 * @namespace FUSE01B
 */
FUSE01B.Goal = Class.create(Sprite, {
    /**
     * オブジェクトの初期化
     *
     * @method initialize
     */
    initialize: function () {
        'use strict';
        var size　= FUSE01B.config.GOAL_SIZE;

        // Spriteオブジェクトの生成
        Sprite.call(this, size, size);

        this.initialSetting();

        // 描画設定
        this.surface = new Surface(size, size);
        this.image = this.surface;

        this.draw();
    },

    /**
     * 初期設定
     *
     * @method initialSetting
     */
    initialSetting: function () {
        'use strict';
        var size, radius, x, y;
        size = FUSE01B.config.GOAL_SIZE;
        radius = size / 2;

        // 初期位置の設定
        x = FUSE01B.config.GOAL_X;
        y = FUSE01B.config.GOAL_Y;
        this.point = new FUSE01B.Point(x, y);

        // Spriteの中心にゴールの中心を設定する
        this.x = this.point.position.x - radius;
        this.y = this.point.position.y - radius;
    },

    /**
     * 描画
     *
     * @method draw
     */
    draw: function () {
        'use strict';
        var v, size, radius, context;
        v = this.point.velocity.length();
        size = FUSE01B.config.GOAL_SIZE;
        radius = size / 2;

        context = this.surface.context;
        context.strokeStyle = "white";
        context.lineWidth = 2;
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

        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "14px 'Consolas', 'Monaco', 'ＭＳ ゴシック'";
        context.fillText("GOAL", size / 2, size / 2, size);
    }
});


/*global enchant, Class, Sprite, Surface, Label, Game */
/*jslint browser:true */

enchant();

/**
 * FUSE01 Bチームアプリ
 * @namespace FUSE01B
 * @author 小久保温, 菅井雄作
 */
var FUSE01B = {};

/**
 * 設定
 *
 * @namespace FUSE01B
 * @class config
 */
FUSE01B.config = {
	SCREEN_WIDTH: 320,
	SCREEN_HEIGHT: 320,
	BALL_SIZE: 16,
	BALL_SPEED_MIN: 2,
	BALL_SPEED_MAX: 5,
	BALL_INITIAL_POSITION_OFFSET: 40,
	AIR_REGISTANCE: 0.003,
	GOAL_X: 280,
	GOAL_Y: 280,
	GOAL_SIZE: 40
};

/**
 * アセット
 *
 * @namespace FUSE01B
 * @class assets
 */
FUSE01B.assets = {
	LV1: "sounds/lv1.mp3",
	LV2: "sounds/lv2.mp3",
	LV3: "sounds/lv3.mp3",
	LV4: "sounds/lv4.mp3",
	WALL_HIT: "sounds/wall-hit.wav"
};
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
/**
 * Vectorオブジェクトを作成
 * @class Vector
 * @constructor
 * @namespace FUSE01B
 * @param {Number} x x成分
 * @param {Number} y y成分
 */
FUSE01B.Vector = function (x, y) {
    'use strict';
    this.x = x;
    this.y = y;
};

/**
 * 長さを設定する
 *
 * @method setLength
 * @param {Number} length 設定する長さ
 */
FUSE01B.Vector.prototype.setLength = function (length) {
    'use strict';
    var scale = length / this.length();
    this.x = scale * this.x;
    this.y = scale * this.y;
};

/**
 * 長さを返す
 *
 * @method length
 * @return {Number} 長さ
 */
FUSE01B.Vector.prototype.length = function () {
    'use strict';
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * 傾角を設定する
 *
 * @method setTheta
 * @param {Number} theta 設定する傾角(単位は度)
 */
FUSE01B.Vector.prototype.setTheta = function (theta) {
    'use strict';
    var length, rad;
    length = this.length();
    rad = FUSE01B.helper.radian(theta);
    this.x = length * Math.cos(rad);
    this.y = length * Math.sin(rad);
};

/**
 * 傾角を返す
 *
 * @method theta
 * @return {Number} 傾角(単位は度)
 */
FUSE01B.Vector.prototype.theta = function () {
    'use strict';
    var rad = Math.atan2(this.y, this.x);
    return FUSE01B.helper.degree(rad);
};

/**
 * 単位ベクトルを返す
 *
 * @method unit
 * @return {Vector} 単位ベクトル
 */
FUSE01B.Vector.prototype.unit = function () {
    'use strict';
    var length, vec;
    length = this.length();
    if (length !== 0) {
        vec = new FUSE01B.Vector(
            this.x / length,
            this.y / length
        );
    } else {
        vec = null;
    }
    return vec;
};

/**
 * 法線単位ベクトルを返す
 *
 * @method normal
 * @return {Vector} 法線単位ベクトル
 */
FUSE01B.Vector.prototype.normal = function () {
    'use strict';
    var length, vec;
    length = this.length();
    if (length !== 0) {
        vec = new FUSE01B.Vector(
            -this.y / length,
            this.x / length
        );
    } else {
        vec = null;
    }
    return vec;
};

/**
 * 内積を返す
 *
 * @method innerProduct
 * @param {Vector} 内積を取る相手のベクトル
 * @return {Number} 内積
 */
FUSE01B.Vector.prototype.innerProduct = function (vector) {
    'use strict';
    return this.x * vector.x + this.y * vector.y;
};

/**
 * ベクトルの和を返す
 *
 * @method add
 * @param {Vector} 和を取る相手のベクトル
 * @return {Vector} ベクトルの和
 */
FUSE01B.Vector.prototype.add = function (vector) {
    'use strict';
    return new FUSE01B.Vector(
        this.x + vector.x,
        this.y + vector.y
    );
};

/**
 * ベクトルの差を返す
 *
 * @method sub
 * @param {Vector} 差を取る相手のベクトル
 * @return {Vector} ベクトルの差
 */
FUSE01B.Vector.prototype.sub = function (vector) {
    'use strict';
    return new FUSE01B.Vector(
        this.x - vector.x,
        this.y - vector.y
    );
};

/**
 * 回転させたベクトルを返す
 *
 * @method rotate
 * @param {Number} 回転角度(単位は度)
 * @return {Vector} 回転させたベクトル
 */
FUSE01B.Vector.prototype.rotate = function (theta) {
    'use strict';
    var rad, sin, cos;
    rad = FUSE01B.helper.radian(theta);
    sin = Math.sin(rad);
    cos = Math.cos(rad);
    return new FUSE01B.Vector(
        this.x * cos - this.y * sin,
        this.x * sin + this.y * cos
    );
};

/**
 * ベクトルを回転させる(破壊的メソッド)
 *
 * @method mRotate
 * @param {Number} 回転角度(単位は度)
 */
FUSE01B.Vector.prototype.mRotate = function (theta) {
    'use strict';
    var rad, sin, cos;
    rad = FUSE01B.helper.radian(theta);
    sin = Math.sin(rad);
    cos = Math.cos(rad);
    this.x = this.x * cos - this.y * sin;
    this.y = this.x * sin + this.y * cos;
};
/**
 * Pointオブジェクトを作成
 * @class Point
 * @constructor
 * @namespace FUSE01B
 * @param {Number} x x座標
 * @param {Number} y y座標
 */
FUSE01B.Point = function (x, y) {
    'use strict';
    this.position = new FUSE01B.Vector(x, y);
    this.velocity = new FUSE01B.Vector(0, 0);
};

/**
 * 回転変換したPointオブジェクトを返す
 *
 * @method rotate
 * @param {Number} degree 回転角度(単位は度)
 * @return {Point} 回転変換したPointオブジェクト
 */
FUSE01B.Point.prototype.rotate = function (degree) {
    'use strict';
    var point;
    point = new FUSE01B.Point();
    point.position = this.position.rotate(degree);
    point.velocity = this.velocity.rotate(degree);

    return point;
};

/**
 * 並進変換したPointオブジェクトを返す
 *
 * @method translate
 * @param {Number} dx 並進のx成分
 * @param {Number} dy 並進のy成分
 * @return {Point} 並進変換したPointオブジェクト
 */
FUSE01B.Point.prototype.translate = function (dx, dy) {
    'use strict';
    var point;
    point = new FUSE01B.Point(dx, dy);
    point.position = point.position.add(this.position);
    point.velocity = this.velocity;

    return point;
};

/**
 * Pointオブジェクトの移動処理(速度の分だけ、位置を変化させる)
 *
 * @method move
 */
FUSE01B.Point.prototype.move = function () {
    'use strict';
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
};
/**
 * Segmentオブジェクトを作成
 * @class Segment
 * @constructor
 * @namespace FUSE01B
 */
FUSE01B.Segment = function () {
    'use strict';
    this.end0 = null;
    this.end1 = null;
    this.vector = null;
};

/**
 * 端点0を設定する
 *
 * @method setEnd0
 * @param {Point} point 端点0の位置
 */
FUSE01B.Segment.prototype.setEnd0 = function (point) {
    'use strict';
    this.end0 = point;
    if (point === null) {
        this.end1 = null;
        this.vector = null;
    } else if (this.end1 !== null) {
        this.setVector();
    }
};

/**
 * 端点1を設定する
 *
 * @method setEnd1
 * @param {Point} point 端点1の位置
 */
FUSE01B.Segment.prototype.setEnd1 = function (point) {
    'use strict';
    this.end1 = point;
    if (point === null) {
        this.end0 = null;
        this.vector = null;
    } else if (this.end0 !== null) {
        this.setVector();
    }
};

/**
 * 端点間を結ぶベクトルを設定する
 *
 * @method setVector
 */
FUSE01B.Segment.prototype.setVector = function () {
    'use strict';
    this.vector = new FUSE01B.Vector(
        this.end1.position.x - this.end0.position.x,
        this.end1.position.y - this.end0.position.y
    );
};

/**
 * 長さを返す
 *
 * @method length
 * @return {Number} 長さ
 */
FUSE01B.Segment.prototype.length = function () {
    'use strict';
    var result;
    if (this.vector !== null) {
        result = this.vector.length();
    } else {
        result = null;
    }
    return result;
};

/**
 * 単位ベクトルを返す
 *
 * @method unit
 * @return {Vector} 単位ベクトル
 */
FUSE01B.Segment.prototype.unit = function () {
    'use strict';
    var result;
    if (this.vector !== null) {
        result = this.vector.unit();
    } else {
        result = null;
    }
    return result;
};

/**
 * 傾角を返す
 *
 * @method theta
 * @return {Vector} 傾角(単位は度)
 */
FUSE01B.Segment.prototype.theta = function () {
    'use strict';
    var result;
    if (this.vector !== null) {
        result = this.vector.theta();
    } else {
        result = null;
    }
    return result;
};

/**
 * 法線ベクトルを返す
 *
 * @method normal
 * @return {Vector} 法線ベクトル
 */
FUSE01B.Segment.prototype.normal = function () {
    'use strict';
    var result;
    if (this.vector !== null) {
        result = this.vector.normal();
    } else {
        result = null;
    }
    return result;
};
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
        var size = FUSE01B.config.BALL_SIZE;

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
/**
 * Goalオブジェクトを作成
 * @class Goal
 * @constructor
 * @namespace FUSE01B
 * @param {Number} x x成分
 * @param {Number} y y成分
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

        this.x = 160;
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

window.onload = function () {
    'use strict';
    var config, assets, key;
    config = FUSE01B.config;

    // Gameオブジェクトの初期化
    FUSE01B.game = new Game(config.SCREEN_WIDTH, config.CREEN_HEIGHT);

    // アセットの事前読み込み
    assets = [];
    for (key in FUSE01B.assets) {
        if (FUSE01B.assets.hasOwnProperty(key)) {
            assets.push(FUSE01B.assets[key]);
        }
    }
    FUSE01B.game.preload(assets);

    /**
     * ゲームの初期化
     *
     * @method onload
     */
    FUSE01B.game.onload = function () {
        var scene, ball, glue, goal, score, life, inGoal, interactWithWall, interact;

        // ルートシーンの生成
        scene = this.rootScene;
        scene.backgroundColor = "black";

        // Ballオブジェクトの生成
        ball = new FUSE01B.Ball();
        ball.wallHitSe = this.assets[FUSE01B.assets.WALL_HIT_SE];
        scene.addChild(ball);

        // Glueオブジェクトの生成
        glue = new FUSE01B.Glue();
        scene.addChild(glue);

        // Goalオブジェクトの生成
        goal = new FUSE01B.Goal();
        scene.addChild(goal);

        // Scoreオブジェクトの生成
        score = new FUSE01B.Score();
        scene.addChild(score);

        // Lifeオブジェクトの生成
        life = new FUSE01B.Life();
        scene.addChild(life);

        /**
         * タッチイベントハンドラの設定
         *
         * @method ontouchstart
         */
        scene.ontouchstart = function (e) {
            var end0;
            // タッチしたところに端点を設定する
            if (glue.segment.end0 === null) {
                glue.segment.setEnd0(new FUSE01B.Point(e.x, e.y));
            } else if (glue.segment.end1 === null) {
                end0 = glue.segment.end0;
                glue.segment.setEnd1(
                    new FUSE01B.Point(
                        end0.position.x,
                        end0.position.y
                    )
                );
                glue.segment.setEnd0(new FUSE01B.Point(e.x, e.y));
            }
        };

        /**
         * フレーム毎の処理
         *
         * @method onenterframe
         */
        scene.onenterframe = function () {
            // ボールとゴールの衝突判定
            inGoal(ball, goal);

            // ボールと壁との衝突処理
            interactWithWall(ball);

            // 紐とボールの衝突処理
            if (glue.segment.end1 !== null) {
                interact(ball, glue);
            }

            // ゲーム終了の判定
            if (ball.point.velocity.length() < 0.5) {
                life.decrement();
                ball.initialSetting();
                glue.initialSetting();
                if (life.value === -1) {
                    FUSE01B.game.end(score.value, "オトリフレクトで" + score.value + "点獲得しました。");
                }
            }
        };

        /**
         * ゴールインの処理
         *
         * @method inGoal
         */
        inGoal = function (ball, goal) {
            var dist2, velocity, threshold;
            threshold = (FUSE01B.config.BALL_SIZE + FUSE01B.config.GOAL_SIZE) / 2;

            dist2 = function (ball, goal) {
                var x0, y0, x1, y1;
                x0 = ball.point.position.x;
                y0 = ball.point.position.y;
                x1 = goal.point.position.x;
                y1 = goal.point.position.y;
                return ((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));
            };

            if (dist2(ball, goal) < threshold * threshold) {
                velocity = ball.point.velocity.length();
                score.add(Math.floor(velocity * 20));
                ball.initialSetting();
                glue.initialSetting();
            }
        };

        /**
         * 壁とボールの衝突処理
         *
         * @method interactWithWall
         * @param {Ball} ball ボール
         */
        interactWithWall = function (ball) {
            var p, v, width, height, radius, isHit, se;

            p = ball.point.position;
            v = ball.point.velocity;

            width = FUSE01B.config.SCREEN_WIDTH;
            height = FUSE01B.config.SCREEN_HEIGHT;
            radius = FUSE01B.config.BALL_SIZE / 2;

            // 左右の壁
            if (p.x < radius) {
                v.x = Math.abs(v.x);
                isHit = true;
            } else if (width - radius < p.x) {
                v.x = -Math.abs(v.x);
                isHit = true;
            }

            // 上下の壁
            if (p.y < radius) {
                v.y = Math.abs(v.y);
                isHit = true;
            } else if (height - radius < p.y) {
                v.y = -Math.abs(v.y);
                isHit = true;
            }

            // SE再生
            if (isHit === true) {
                se = FUSE01B.game.assets[FUSE01B.assets.WALL_HIT];
                se.stop();
                se.play();
            }
        };

        /**
         * 紐とボールの衝突処理
         *
         * @method interact
         * @param {Ball} ball ボールオブジェクト
         * @param {Glue} glue 紐オブジェクト
         */
        interact = function (ball, glue) {
            var isHit, radius, theta, p, length, l0x, l1x, ly, v, n, proj, u, se, velocity;
            isHit = false;

            radius = FUSE01B.config.BALL_SIZE / 2;

            length = glue.segment.length();
            theta = glue.segment.theta();

            // ボールの座標を紐座標系に変換する
            p = ball.point.translate(
                -glue.segment.end0.position.x,
                -glue.segment.end0.position.y
            );
            p = p.rotate(-theta);

            /* 紐座標系で衝突判定を行なう */
            // 端点0座標系でのボールのx座標
            l0x = p.position.x;
            // 端点1座標系でのボールのx座標
            l1x = p.position.x - length;
            // 端点座標系でのボールのy座標
            ly = Math.abs(p.position.y);

            // 先に大雑把に除外する(計算時間節約のため)
            if (l0x < -radius || radius < l1x || radius < ly) {
                isHit = false;
            } else if (l0x < 0) {
                // 端点0の近傍での衝突判定
                if ((l0x * l0x + ly * ly) < (radius * radius)) {
                    isHit = true;

                    // 端点0での反射の処理
                    v = ball.point.velocity;
                    u = new FUSE01B.Vector(
                        glue.segment.end0.position.x - ball.point.position.x,
                        glue.segment.end0.position.y - ball.point.position.y
                    );
                    u = u.unit();
                    proj = v.innerProduct(u);
                    v.x = v.x - 2 * proj * u.x;
                    v.y = v.y - 2 * proj * u.y;
                }
            } else if (0 < l1x) {

                // 端点1の近傍での衝突判定
                if ((l1x * l1x + ly * ly) < (radius * radius)) {
                    isHit = true;

                    // 端点1での反射の処理
                    v = ball.point.velocity;
                    u = new FUSE01B.Vector(
                        glue.segment.end1.position.x - ball.point.position.x,
                        glue.segment.end1.position.y - ball.point.position.y
                    );
                    u = u.unit();
                    proj = v.innerProduct(u);
                    v.x = v.x - 2 * proj * u.x;
                    v.y = v.y - 2 * proj * u.y;
                }
            } else {
                isHit = true;
                // 紐とボールの反射
                v = ball.point.velocity;
                n = glue.segment.normal();
                proj = v.innerProduct(n);
                v.x = v.x - 2 * proj * n.x;
                v.y = v.y - 2 * proj * n.y;
            }

            if (isHit === true) {
                // 紐の消去
                glue.segment.setEnd0(null);
                glue.segment.setEnd1(null);

                // サウンド処理
                if (length < 60) {
                    //value = 100;
                    velocity = 2;
                    se = FUSE01B.game.assets[FUSE01B.assets.LV1];
                } else if (length < 120) {
                    //value = 50;
                    velocity = 1;
                    se = FUSE01B.game.assets[FUSE01B.assets.LV2];
                } else if (length < 200) {
                    //value = 30;
                    velocity = 0.5;
                    se = FUSE01B.game.assets[FUSE01B.assets.LV3];
                } else {
                    //value = 20;
                    velocity = 0.25;
                    se = FUSE01B.game.assets[FUSE01B.assets.LV4];
                }
                ball.gainVelocity(velocity);
                se.stop();
                se.play();

                // 得点の処理
                //score.add(value);

            }
        };

    };

    // ゲームのスタート
    FUSE01B.game.start();
};

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

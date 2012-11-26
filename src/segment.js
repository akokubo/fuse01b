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

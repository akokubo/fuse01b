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

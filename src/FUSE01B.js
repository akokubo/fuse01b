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

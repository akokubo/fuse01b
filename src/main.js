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

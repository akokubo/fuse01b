all: src/FUSE01B.js src/helper.js src/vector.js src/point.js src/segment.js src/ball.js src/glue.js src/goal.js src/score.js src/life.js src/main.js
	cat src/FUSE01B.js src/helper.js src/vector.js src/point.js src/segment.js src/ball.js src/glue.js src/goal.js src/score.js src/life.js src/main.js > fuse01b/all.js
	chmod 644 fuse01b/all.js

release: fuse01b/all.js fuse01b/enchant.min.js fuse01b/end.png fuse01b/index.html fuse01b/plugins/nineleap.enchant.js fuse01b/sounds/lv1.mp3 fuse01b/sounds/lv2.mp3 fuse01b/sounds/lv3.mp3 fuse01b/sounds/lv4.mp3 fuse01b/sounds/wall-hit.wav fuse01b/start.png
	-rm fuse01b.zip
	zip -r fuse01b.zip fuse01b

clean:
	-rm fuse01b.zip
	-rm fuse01b/all.js

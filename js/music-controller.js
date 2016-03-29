/**
 * 定义歌曲播放列表
 * @type {Array}
 */
var lists = [{
	author: "author1",
	name: "name1",
	src: "mp3/1.mp3",
	cover: "img/1.jpg"
}, {
	author: "author2",
	name: "name2",
	src: "mp3/2.mp3",
	cover: "img/2.jpg"
}, {
	author: "author3",
	name: "name3",
	src: "mp3/3.mp3",
	cover: "img/3.jpg"
}, {
	author: "author4",
	name: "name4",
	src: "mp3/4.mp3",
	cover: "img/4.jpg"
}];
var listLength = lists.length;
/**
 * 获取音乐播放控件的DOM对象
 * @type {[type]}
 */
var music = $('#music')[0];
/**
 * 定义当前播放歌曲序号
 * @type {Number}
 */
var musicNow = 0;
	/**
	 * 设定播放模式
	 * 0 => 列表循环
	 * 1 => 单曲循环
	 * 2 => 随即播放
	 */
var musicMode = 0;
/**
 * 设置初始音量
 */
music.volume = 0.8;
/**
 * 生成播放列表
 */
function init() {
	for (var i = 0; i < listLength; i++) {
		var tr = '<tr class="row"><td class="list-name">'
		 + lists[i].name + '</td><td class="list-author">'
		 + lists[i].author + '</td></tr>';
		 $('table').append(tr);
	}
}
/**
 * 播放暂停处理程序
 */
function togglePlay() {
	if (music.paused) {
		$('#music-play').removeClass('glyphicon-play');
		$('#music-play').addClass('glyphicon-pause');
		music.play();
		$('.album-cover').removeClass('animation-paused');
	} else {
		$('#music-play').addClass('glyphicon-play');
		$('#music-play').removeClass('glyphicon-pause');
		music.pause();
		$('.album-cover').addClass('animation-paused');
	}
}

/**
 * 设置上一曲处理程序
 */
function preMusic() {
	switch (musicMode) {
		case 0:
			musicNow--;
			if (musicNow < 0) {
				musicNow = listLength - 1;
			}
			break;
		case 1:
			break;
		case 2:
			musicNow = parseInt(listLength * Math.random());
			break;
	}
	$('#music-play').removeClass('glyphicon-play');
	$('#music-play').addClass('glyphicon-pause');
	freshInformation();
	$('.album-cover').removeClass('animation-paused');
}

/**
 * 设置下一曲处理程序
 */
function nextMusic() {
	switch (musicMode) {
		case 0:
			musicNow++;
			if (musicNow > (listLength - 1)) {
				musicNow = 0;
			}
			break;
		case 1:
			break;
		case 2:
			musicNow = parseInt(listLength * Math.random());
			break;
	}
	$('#music-play').removeClass('glyphicon-play');
	$('#music-play').addClass('glyphicon-pause');
	freshInformation();
	$('.album-cover').removeClass('animation-paused');
}

/**
 * 设置停止处理程序
 */
function stopMusic() {
	music.load();
	$('#music-play').addClass('glyphicon-play');
	$('#music-play').removeClass('glyphicon-pause');
	music.pause();
	$('.album-cover').addClass('animation-paused');
}

/**
 * 设置进度条点击进度跳转程序
 */
function progressJump(event) {
	var i = event.offsetX / 470;
	music.currentTime = i * music.duration;
}

/**
 * 设置音量控制函数
 */
function volumeJump(event) {
	music.muted = false;
	var i = event.offsetX / 50;
	var percentI = toPercent(i);
	music.volume = i;
	freshVolume();
	$('.volume-progress-bar').css({
		width: percentI
	});
}

/**
 * 刷新音量图标
 */
function freshVolume() {
	if (music.volume <= 1 && music.volume > 0.5) {
		$('.volume-icon').removeClass('glyphicon-volume-off');
		$('.volume-icon').removeClass('glyphicon-volume-down');
		$('.volume-icon').addClass('glyphicon-volume-up');
	} else if (music.volume > 0 && music.volume <= 0.5) {
		$('.volume-icon').removeClass('glyphicon-volume-off');
		$('.volume-icon').addClass('glyphicon-volume-down');
		$('.volume-icon').removeClass('glyphicon-volume-up');
	} else if (music.volume === 0) {
		$('.volume-icon').addClass('glyphicon-volume-off');
		$('.volume-icon').removeClass('glyphicon-volume-down');
		$('.volume-icon').removeClass('glyphicon-volume-up');
	}
}

/**
 * 设置播放器专辑图，歌手，歌曲名，歌曲文件路径
 * @return {[type]} [description]
 */
function freshInformation() {
	$('.author').text(lists[musicNow].author);
	$('.name').text(lists[musicNow].name);
	$('.album-cover').attr("src", lists[musicNow].cover);
	$('#music').attr('src', lists[musicNow].src);
}
/**
 * 设置数字转换为百分比的函数
 */
function toPercent(data) {
	var strData = parseFloat(data) * 100;
	var ret = strData.toString() + "%";
	return ret;
}
/**
 * 设置滚动条刷新函数
 */
function freshProgress() {
	var i = toPercent(music.currentTime / music.duration);
	$('.progress-bar').css({
		width: i
	});
	if(music.ended){
		nextMusic();
	}
}
/**
 * 设置改变播放模式函数
 */
function changeMode() {
	musicMode++;
	if (musicMode > 2) {
		musicMode = 0;
	} else if (musicMode < 0) {
		musicMode = 2;
	}
	switch (musicMode) {
		case 0:
			$('.music-mode').addClass('glyphicon-refresh');
			$('.music-mode').removeClass('glyphicon-repeat');
			$('.music-mode').removeClass('glyphicon-random');
			break;
		case 1:
			$('.music-mode').removeClass('glyphicon-refresh');
			$('.music-mode').addClass('glyphicon-repeat');
			$('.music-mode').removeClass('glyphicon-random');
			break;
		case 2:
			$('.music-mode').removeClass('glyphicon-refresh');
			$('.music-mode').removeClass('glyphicon-repeat');
			$('.music-mode').addClass('glyphicon-random');
			break;
	}
}
/**
 * 静音按键控制程序
 */
function volumeMuted() {
	if (music.muted) {
		music.muted = false;
		freshVolume();
		var temp = toPercent(music.volume);
		$('.volume-progress-bar').css({
			width: temp
		});
	} else {
		music.muted = true;
		$('.volume-icon').addClass('glyphicon-volume-off');
		$('.volume-icon').removeClass('glyphicon-volume-down');
		$('.volume-icon').removeClass('glyphicon-volume-up');
		$('.volume-progress-bar').css({
			width: 0
		});
	}
}
/**
 * 网页开启时加载脚本
 * @return {[type]}   [description]
 */
$(document).ready(function() {
	switch (musicMode) {
		case 0:
			$('.music-mode').addClass('glyphicon-refresh');
			break;
		case 1:
			$('.music-mode').addClass('glyphicon-repeat');
			break;
		case 2:
			$('.music-mode').addClass('glyphicon-random');
			break;
	}
	$('.volume-progress-bar').css({
		width: toPercent(music.volume)
	});

	freshInformation();
	freshVolume();

	setInterval(freshProgress, 100);
	init();
	$('#music-play').click(togglePlay);
	$('.glyphicon-fast-backward').click(preMusic);
	$('.glyphicon-fast-forward').click(nextMusic);
	$('.glyphicon-stop').click(stopMusic);
	$('.progress').mousedown(progressJump);
	$('.volume-progress').mousedown(volumeJump);
	$('.music-mode').click(changeMode);
	$('.volume-icon').click(volumeMuted);
	$('.music-list').mouseover(function() {
		console.log("mouseover");
		$('.music-list-dialog').fadeIn();
	});
	$('.music-list').mouseout(function() {
		$('.music-list-dialog').fadeOut();
	});
});
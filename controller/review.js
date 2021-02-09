$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
	var player2 = videojs('playeri', {
		controls: true,
		preload: 'auto',
		responsive: true,
		aspectRatio: '1:1',
		nativeControlsForTouch: true
	});
	setStorage = function (key, val) {
		return storage.setItem(key, val);
	}
	getStorage = function (key) {
		return storage.getItem(key);
	}
	removeStorage = function (key) {
		return storage.removeItem(key);
	}
	getNotif = function (message) {
		ons.notification.toast(message, { timeout: 2000, animation: 'ascend' });
	}
	// $('#playeri source').attr('src', getStorage('url_template')+getStorage('template'));
	// $("#playeri")[0].load();
	// $("#playeri")[0].play();
	player2.src({type: 'video/mp4', src: getStorage('url_template')+getStorage('template')});
	player2.ready(function() {
		player2.play();
	});
    const nama = getStorage('template').substr(0, 23);
    const name = (nama.length == 23 ? nama+'...' : nama);
	$('#jdl-tmp').text(name);
	$('#btn-stop-video').click(function () {
		player2.dispose();
		myPage.resetToPage('page/step-1.html', {animation:'slide'});
	});
	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}

	// if ($(window).width() < 1281) {
	// 	$('#vdnya').attr('width', '100%');
	// }else {
	// 	$('#vdnya').attr('width', '50%');
	// }
});
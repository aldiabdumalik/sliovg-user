$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
	var player = videojs(document.querySelector('#playerr'), {
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
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET",`${url_api}get-myvideolink-id.json?file=${getStorage('myvideo-detail')}`, true);
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$('#judul_video').text(result.data.nama_video);
			player.src({type: 'video/mp4', src: result.url});
			player.ready(function() {
				player.play();
			});
		}else{
			ons.notification.confirm(result.message, {buttonLabels:["Ya"]}).then(function (index) {
				myPage.resetToPage('page/myvideo.html', {animation:'fade'});
			});
		}
	}
	xhr.send();
	return false;

	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
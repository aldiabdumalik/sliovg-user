$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
	const players = new Plyr('#playerz');
	window.players = players;
	$('#playerz source').attr('src', 'assets/video/Petunjuk Penggunaan.mp4');
	$("#playerz")[0].load();
	$("#playerz")[0].play();
	
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
	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
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

	$('#myvideo-edit-id').val(getStorage('myvideo-detail'));

	$('#myvideo-edit-form').submit(function () {
		const data = {
			'id' : $('#myvideo-edit-id').val(),
			'nama' : $('#myvideo-edit-nama').val()
		};
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST",`${url_api}get-myvideo.json`, true);
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			ons.notification.toast(result.message, { timeout: 1500, animation: 'ascend' }).then(function () {
				myPage.resetToPage('page/myvideo.html', {animation:'slide'});
			});
		}
		xhr.send(JSON.stringify(data));
		return false;
	});

	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
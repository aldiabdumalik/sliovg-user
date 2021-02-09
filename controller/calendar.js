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
	var calendar = $('#calendar').fullCalendar({
		header:{
			left:'prev,next today',
			center:'title',
			right:'month'
		},
		events: `${url_api}fullcalendar.json`,
		eventColor: '#1A2C39',
		eventClick: function(info) {
			console.log(info.start.format());
			$.ajax({
				url: `${url_api}event.json`,
				type: 'GET',
				data: {kalender:info.start.format()},
				success: function (response) {
					$('#detail-event').empty();
					$.each(response.data, function (i, data) {
						$('#detail-event').append(`
							<ons-list-item>
								<div class="center">
									<span class="list-item__title">${data.title}</span>
									<span class="list-item__subtitle">${data.deskripsi}</span>
								</div>
							</ons-list-item>
						`);
					});
				}
			});
		}
	});

	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
	$('#reporting-pagination').pagination({
        cssStyle: 'compact-theme',
        itemsOnPage: 6,
        onPageClick (pageNumber, event){
        	getMyVideo(pageNumber-1);
        }
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
	function getMyVideo(page) {
		$.ajax({
			url:`${url_api}get-myvideo.json`,
			type: 'GET',
			data: {myid:getStorage('mytoken'), page:page},
			success: function (response) {
				if (response.status == true) {
					$('#list-reporting').empty();
					$('#reporting-pagination').pagination('updateItems', response.jml_data);
					$.each(response.data, function (i, data) {
						// const status = (data.status_video == 1 ? 1 : 'hilang');
						$('#list-reporting').append(`
							<ons-col width="50%" class="bg-white" data-id="${data.id_render}" style="padding:10px;">
								<img src="assets/thumb/${data.template}.jpg" class="img-responsive" alt="template">
								<span class="text-template text-navy mb-10">${data.nama_video}</span>
								<button class="btn-myvideo btn-yellow text-white btn-report" data-id="${data.id_render}">Report</button>
							</ons-col>
						`);
					});
				}
				$('#reporting-pagination ul li span.prev').css({'background': '#002b3a', 'color': '#FFF'});
				$('#reporting-pagination ul li span.next').css({'background': '#fdbd10'});
				$('#reporting-pagination ul li a.prev').css({'background': '#002b3a', 'color': '#FFF'});
				$('#reporting-pagination ul li a.next').css({'background': '#fdbd10'});
			}
		});
	}
	getMyVideo(0);

	$(document).on('click', '.btn-report',function () {
		setStorage('reporting-detail', $(this).data('id'));
		myPage.resetToPage('page/reporting-detail.html', {animation:'slide'});
	});

	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
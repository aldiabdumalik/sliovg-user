$(document).ready(function () {
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	const storage = window.localStorage;
	$('#myvideo-pagination').pagination({
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
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("GET",`${url_api}get-myvideo.json?myid=${getStorage('mytoken')}&page=${page}`, true);
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$('#list-myvideo').empty();
				$('#myvideo-pagination').pagination('updateItems', result.jml_data);
				$.each(result.data, function (i, data) {
					const status = (data.status_video == 1 ? 1 : 'hilang');
					const nama = (data.nama_sementara != null ? data.nama_sementara : data.nama_video)
					$('#list-myvideo').append(`
						<ons-col width="50%" class="bg-white" data-id="${data.nama_video}" style="padding:10px;">
							<img src="${data.thumb}" class="img-responsive pilih-myvideo" data-id="${data.nama_video}" alt="${data.nama_video}">
							<span class="text-template text-navy mb-10">${nama}</span>
						</ons-col>
					`);
				});
			}
			$('#myvideo-pagination ul li span.prev').css({'background': '#002b3a', 'color': '#FFF'});
			$('#myvideo-pagination ul li span.next').css({'background': '#fdbd10'});
			$('#myvideo-pagination ul li a.prev').css({'background': '#002b3a', 'color': '#FFF'});
			$('#myvideo-pagination ul li a.next').css({'background': '#fdbd10'});
		}
		xhr.send();
		return false;
	}
	getMyVideo(0);

	$(document).on('click', '.download-myvideo',function () {
		window.open(`${url_api}download-myvideo.json?file=${$(this).data('id')}`, '_blank');
	});

	$(document).on('click', '.hapus-myvideo',function () {
		setStorage('myvideo-detail', $(this).data('id'));
		ons.notification.confirm('Apakah Anda yakin akan menghapus video ini?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
			if (index==0) {
				console.log(getStorage('myvideo-detail'));
				const xhr = new XMLHttpRequest();
				xhr.onloadstart = function () {
		            $('ons-modal').show();
		        }
				xhr.open("GET",`${url_api}delete-myvideo.json?myid=${getStorage('mytoken')}&videoid=${getStorage('myvideo-detail')}`, true);
				xhr.onload = function () {
					const result = JSON.parse(this.responseText);
					$('ons-modal').hide();
					if (result.status == true) {
						ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' }).then(function () {
				// 			myPage.resetToPage('page/myvideo.html', {animation:'slide'});
				            getMyVideo(0);
						});
					}
				}
				xhr.send();
				return false;
			}
		});
	});

	$(document).on('click', '.pilih-myvideo',function () {
		const is_id = $(this).data('id');
		setStorage('myvideo-detail', $(this).data('id'));
		ons.openActionSheet({
		    title: $(this).data('id'),
		    cancelable: true,
		    buttons: [
		    	'Play Video',
				'Ubah Nama',
				'Download',
				'Share',
				'Hapus',
				{
					label: 'Cancel',
					icon: 'md-close'
				}
		    ]
		}).then(function (index) {
			if (index == 2) {
				window.open(`${url_api}download-myvideo.json?file=${is_id}`, '_blank');
				$('ons-action-sheet').hide();
			}else if (index == 0 || index == 3) {
				myPage.resetToPage('page/myvideo-share.html', {animation:'slide'}).then(function () {
					window.open(`${url_api}download-myvideo.json?file=${is_id}`, '_blank');
				});
				$('ons-action-sheet').hide();
			}else if (index == 1) {
				myPage.resetToPage('page/myvideo-edit.html', {animation:'slide'});
				$('ons-action-sheet').hide();
			}else if (index == 4) {
				hapus_video(is_id);
				$('ons-action-sheet').hide();
			}
		});
		$('.action-sheet-title').css({'color':'red'});
	});

	function hapus_video(id) {
		ons.notification.confirm('Apakah Anda yakin akan menghapus video ini?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
			console.log(id);
			if (index==0) {
				const xhr = new XMLHttpRequest();
				xhr.onloadstart = function () {
		            $('ons-modal').show();
		        }
				xhr.open("GET",`${url_api}delete-myvideo.json?myid=${getStorage('mytoken')}&videoid=${id}`, true);
				xhr.onload = function () {
					const result = JSON.parse(this.responseText);
					$('ons-modal').hide();
					if (result.status == true) {
						ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' }).then(function () {
				// 			myPage.resetToPage('page/myvideo.html', {animation:'slide'});
				            getMyVideo(0);
						});
					}
				}
				xhr.send();
				return false;
			}
		});
	}

	function getLinkVideo(file) {
		myPage.resetToPage('page/myvideo-share.html', {animation:'slide'});
	}
	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
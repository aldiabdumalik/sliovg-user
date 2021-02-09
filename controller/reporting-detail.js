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
	console.log(getStorage('reporting-detail'));
	load_awal();
	function load_awal() {
		$.ajax({
			url:`${url_api}get-report-id.json`,
			type: 'GET',
			data: {myid:getStorage('mytoken'), videoid:getStorage('reporting-detail')},
			success: function (response) {
				console.log(response);
				if (response.status == true) {
					const fb = (response.data.fb_share == null ? 0 : response.data.fb_share);
					const twitter = (response.data.twitter_share == null ? 0 : response.data.twitter_share);
					const ig = (response.data.ig_share == null ? 0 : response.data.ig_share);
					const yt = (response.data.yt_share == null ? 0 : response.data.yt_share);
					const wa = (response.data.wa_share == null ? 0 : response.data.wa_share);
					const linkedin = (response.data.linkedin_share == null ? 0 : response.data.linkedin_share);
					$('#thumb-report-id').html(`
						<ons-col class="bg-white" style="padding:10px;">
							<img src="assets/thumb/${response.data.template}.jpg" class="img-responsive" alt="${response.data.template}">
							<span class="text-navy mb-10">${response.data.nama_video}</span>
						</ons-col>
					`);
					$('#report-sosmed').html(`
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/fb.png" class="img-responsive img-40" alt="Template">
								Facebook &nbsp; <span class="text-navy">${fb}</span>
							</div>
						</ons-col>
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/twitter.png" class="img-responsive img-40" alt="Template">
								Twitter &nbsp; <span class="text-navy">${twitter}</span>
							</div>
						</ons-col>
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/ig.png" class="img-responsive img-40" alt="Template">
								Instagram &nbsp; <span class="text-navy">${ig}</span>
							</div>
						</ons-col>
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/yt.png" class="img-responsive img-40" alt="Template">
								YouTube &nbsp; <span class="text-navy">${yt}</span>
							</div>
						</ons-col>
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/wa.png" class="img-responsive img-40" alt="Template">
								Whatsaap &nbsp; <span class="text-navy">${wa}</span>
							</div>
						</ons-col>
						<ons-col width="50%" class="count-sosmed" style="background:#FFF;" data-id="${getStorage('reporting-detail')}">
							<div class="img-and-text" style="font-size:14px;">
								<img src="assets/img/linked.png" class="img-responsive img-40" alt="Template">
								Linkedin &nbsp; <span class="text-navy">${linkedin}</span>
							</div>
						</ons-col>
					`);
					$('#rfb').val(fb);
					$('#rtwitter').val(twitter);
					$('#rig').val(ig);
					$('#ryt').val(yt);
					$('#rwa').val(wa);
					$('#rlinkedin').val(linkedin);
				}
			}
		});
	}
	$('#input-report').click(function () {
		$('#modal-form').show();
	});
	$('#close-modal-form').click(function () {
		$('#modal-form').hide();
	});
	$('#btn-report-kirim').click(function () {
		const data = JSON.stringify({
			'videoid':getStorage('reporting-detail'),
			'fb':$('#rfb').val(),
			'twitter':$('#rtwitter').val(),
			'ig':$('#rig').val(),
			'yt':$('#ryt').val(),
			'wa':$('#rwa').val(),
			'linkedin':$('#rlinkedin').val(),
		});
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('#modal-loading').show();
        }
		xhr.open("POST", `${url_api}input-report.json`, true);
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('#modal-loading').hide();
			if (result.status == true) {
				getNotif(result.message);
				load_awal();
				$('#modal-form').hide();
			}
		}
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.send(data);
		return false;
	});
	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
});
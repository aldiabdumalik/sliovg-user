$(document).ready(function () {
	const storage = window.localStorage;
	const url = $('#myurl').data('url');
	const url_api = $('#myurl').data('url') + 'api/';
	// tools
	function setStorage (key, val) {
		return storage.setItem(key, val);
	}
	function getStorage (key) {
		return storage.getItem(key);
	}
	function removeStorage (key) {
		return storage.removeItem(key);
	}
	function getNotif (message) {
		ons.notification.toast(message, { timeout: 2000, animation: 'ascend' });
	}

	console.log(getStorage('mydistribution'));

	$('#mybio').html(`
		<i class="fa fa-user text-yellow"></i> ${getStorage('myname')} <br/><br/>
		<i class="fa fa-user text-yellow"></i> ${getStorage('myemail')} <br/><br/> 
		<i class="fa fa-phone text-yellow"></i> ${getStorage('mywa')} <br/><br/>
	`);

	if (getStorage('mytoken') == null) {
		myPage.resetToPage('page/login.html', {animation:'slide'});
	}
	$('#txt-myname').text(getStorage('myname'));
	if (getStorage('myphoto') != null) {
		$('#myphoto').attr('src', `https://sunlife.beyond-client.com/assets/images/users/${getStorage('myphoto')}`);
		// const photo = `url(https://sunlife.beyond-client.com/assets/images/users/${getStorage('myphoto')})`;
		// $('#myphoto').css('background', 'url(https://sunlife.beyond-client.com/assets/images/users/20200429_203733.jpg)');
	}
	$('#btn-logout').click(function () {
		ons.notification.confirm('Apakah Anda yakin akan keluar?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
			if (index==0) {
				window.localStorage.clear();
				myPage.resetToPage('page/login.html', {animation:'fade'});
			}
		});
	});


	// var modal2 = document.querySelector(".modal2");
	// function toggleModal() {
 //        modal2.classList.toggle("show-modal2");
 //    }
 //    function windowOnClick(event) {
 //        if (event.target === modal2) {
 //            toggleModal();
 //        }
 //    }
 //    $('#oprn').click(function () {
 //    	toggleModal();
 //    });
 //    $('.close-button-modal2').click(function () {
 //    	toggleModal();
 //    });
 //    window.addEventListener("click", windowOnClick);
 //    const players = new Plyr('#player5');
	// window.players = players;
});
const base_url = 'https://ruangmember.xyz/';
const base_url2 = 'https://ruangmember.xyz/';
const url_api = 'https://ruangmember.xyz/api/';
moment.locale('id');
document.addEventListener("deviceready", function () {
	document.addEventListener('init', function(event) {
		const page = event.target;
		if (page.matches('#page-loading')) {
			if (localStorage.getItem("id_plm") != undefined && localStorage.getItem("id_plm") != "" && localStorage.getItem("id_plm") != null) {
				myPage.resetToPage('page/pin.html', {animation:'fade'});
			}else{
				if (localStorage.getItem("id_sementara") != undefined && localStorage.getItem("id_sementara") != "" && localStorage.getItem("id_sementara") != null) {
					myPage.resetToPage('page/pin.html', {animation:'fade'});
				}else{
					myPage.resetToPage('page/login.html', {animation:'fade'});
				}
			}
		};
		if (page.matches('#page-pin')) {
			document.getElementById('pin-1').focus();
			moveOnMax = function (field, nextFieldID) {
				if ($(field).val().length == 1) {
					document.getElementById(nextFieldID).focus();
				}
			}
			moveOnDelete();
			cek_pin();
		}
		if (page.matches('#page-login')) {
			masuk();
			exit_app();
		};
		if (page.matches('#page-register')) {
			pendaftaran();
			back_button('login.html');
		};
		if (page.matches('#page-beranda')) {
			beranda();
			exit_app();
		};
		if (page.matches('#page-produk')) {
			produk_all();
			back_button('beranda.html');
		};
		if (page.matches('#page-pertemuan')) {
			pertemuan();
			back_button('beranda.html');
		};
		if (page.matches('#page-profile')) {
			profile_update();
			back_button('pengaturan.html');
		};
		if (page.matches('#page-bank')) {
			bank_update();
			back_button('pengaturan.html');
		};
		if (page.matches('#page-flip')) {
			flip();
			back_button('beranda.html');
		};
		if (page.matches('#page-persentasi')) {
			persentasi();
			back_button('beranda.html');
		};
		if (page.matches('#page-plan')) {
			plan();
			back_button('beranda.html');
		};
		if (page.matches('#page-basic')) {
			basic();
			back_button('beranda.html');
		};
		if (page.matches('#page-testimoni')) {
			testimoni();
			back_button('beranda.html');
		};
		if (page.matches('#page-order')) {
			order_cart();
			getLocal_consumer();
			back_button('beranda.html');
		};
		if (page.matches('#page-order-produk')) {
			order_produk();
			order_produk_onchange();
			back_button('order.html');
		}
		if (page.matches('#page-order-confirm')) {
			order_confirm();
			back_button('order.html');
		}
		if (page.matches('#page-order-confirm-upload')) {
			order_confirm_upload();
			back_button('order_confirm.html');
		}
		if (page.matches('#page-order-confirm-bukti')) {
			back_button('order_confirm.html');
		}
	});
}, false);
function pendaftaran() {
	$('#form-register').submit(function () {
		const xhr = new XMLHttpRequest();
		if ($('#register-password').val() !== $('#register-password-ulangi').val()) {
			ons.notification.toast('Password yang anda masukan tidak sama', { timeout: 1000, animation: 'ascend' });
		}else if($('#register-password').val().length <= 7){
			ons.notification.toast('Password yang anda masukan kurang dari 8 karakter', { timeout: 1000, animation: 'ascend' });
		}else{
			xhr.onloadstart = function () {
                $('#modal-register').show();
            }
			xhr.open("POST", url_api + 'daftar.json', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				const result = JSON.parse(this.responseText);
				$('#modal-register').hide();
				if (result['status']==true) {
					localStorage.setItem('id_sementara', $('#register-id').val());
					myPage.resetToPage('page/pin.html', {animation:'fade'}).then(function () {
						ons.notification.alert(result['message'], {title:'Pemberitahuan'});
					});
				}else{
					ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
				}
			};
			xhr.send($("#form-register").serialize());
		}
		return false;
	});
}

function masuk() {
	$('#form-login').submit(function () {
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('#modal-login').show();
        }
		xhr.open("POST", url_api + 'login.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('#modal-login').hide();
			ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' }).then(function () {
				if (result['status']==true) {
					localStorage.setItem("id_plm", result['data']['id_plm']);
					myPage.resetToPage('page/beranda.html', {animation:'fade'});
				}
			});
		};
		xhr.send($("#form-login").serialize());
		return false;
	});
}

function cek_pin() {
	$('#pin-6').keyup(function () {
		const idSales = (localStorage.getItem("id_plm") ? localStorage.getItem("id_plm") : localStorage.getItem("id_sementara"));
		const sales = 
			'idSales='+idSales+
			'&pin='+$('#pin-1').val()+$('#pin-2').val()+$('#pin-3').val()+$('#pin-4').val()+$('#pin-5').val()+$('#pin-6').val();
		console.log(sales);
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
        }
		xhr.open("POST", url_api + 'cek_pin.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			if (result['status']==true) {
				localStorage.setItem("id_plm", result['data']['id_plm']);
				myPage.resetToPage('page/beranda.html', {animation:'fade'});
			}else{
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send(sales);
		return false;
	});
}

function beranda() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
    }
	xhr.open("GET", url_api + 'standar.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('#peg-standar').attr('onclick', 'standar_video('+"'"+result['data']['linkYoutube']+"'"+')');
	};
	xhr.send();
	return false;
}

function standar_video(link_video) {
	try {
		window.InAppYouTube.openVideo(link_video, {
			fullscreen: true
		}, function(result) {
			console.log(JSON.stringify(result));
		}, function(reason) {
			console.log(reason);
		});
	} catch(e) {}
}

function profile() {
	myPage.resetToPage('page/pengaturan_profile.html', {animation:'fade'});
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        // $('ons-modal').show();
        console.log();
    }
	xhr.open("GET", url_api + 'sales.json?idSales='+localStorage.getItem("id_plm"), true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$('#profile-id').val(result['data']['id_plm']);
			$('#profile-nama').val(result['data']['nama_sales']);
			$('#profile-nowa').val(result['data']['nowa_sales']);
		}
	};
	xhr.send();
	return false;
}

function profile_update() {
	$('#form-profile').submit(function () {
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST", url_api + 'sales.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' }).then(function () {
				if (result['status']==true) {
					myPage.resetToPage('page/pengaturan.html', {animation:'fade'});
				}
			});
		};
		xhr.send($("#form-profile").serialize());
		return false;
	});
}

function bank() {
	myPage.resetToPage('page/pengaturan_bank.html', {animation:'fade'});
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'bank.json?idSales='+localStorage.getItem("id_plm"), true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('#id_plm').val(localStorage.getItem("id_plm"));
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$('#nama_bank').val(result['data']['nama_bank']);
			$('#norek_bank').val(result['data']['norek_bank']);
			$('#an_bank').val(result['data']['an_bank']);
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function bank_update() {
	$('#form-bank').submit(function () {
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST", url_api + 'bank.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' }).then(function () {
				if (result['status']==true) {
					myPage.resetToPage('page/pengaturan.html', {animation:'fade'});
				}
			});
		};
		xhr.send($("#form-bank").serialize());
		return false;
	});
}

function produk_all() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('#modal-produk').show();
    }
	xhr.open("GET", url_api + 'produk_all.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('#modal-produk').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-info-produk').append(
					'<ons-list-item modifier="longdivider chevron" tappable onclick="produk_detail('+data['idProduk']+');myPage.resetToPage('+"'page/produk_detail.html'"+');">'+
						'<div class="left"><img class="list-item__thumbnail" src="'+base_url+'assets/img/produk/'+data['fotoProduk']+'"></div>'+
						'<div class="center"><span class="list-item__title">'+data['namaProduk']+'</span><span class="list-item__subtitle">Stock : '+data['stokProduk']+'</span></div>'+
					'</ons-list-item>'
				);
			});
		}
	};
	xhr.send();
	return false;
}

function produk_detail(id_produk) {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('#modal-produk').show();
    }
	xhr.open("GET", url_api + 'produk_all.json?idProduk='+id_produk, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('#modal-produk').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$('#img-produk-detail').attr('src', base_url+'assets/img/produk/'+result['data']['fotoProduk']);
			$('#title-produk-detail').append(result['data']['namaProduk']);
			$('#deskripsi-produk-detail').append(result['data']['deskripsiProduk']);
		}
	};
	xhr.send();
	return false;
}

function pertemuan() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'pertemuan.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-info-pertemuan').append(
					'<ons-list-item modifier="longdivider" tappable expandable>'+
						'<div class="left"><i class="fa fa-calendar-o fa-3x fa-blue"></i></div>'+
						'<div class="center"><span class="list-item__title">'+data['namaPertemuan']+'</span><span class="list-item__subtitle">'+moment(data['tanggalPertemuan'], "YYYY-MM-DD HH:mm:ss").format('DD-MM-YYYY HH:mm')+' WIB</span></div>'+
						'<div class="expandable-content">'+
						'<table>'+
							'<tr><td>House Couple</td><td>:</td><td>'+data['houseCouple']+'</td></tr>'+
							'<tr><td>Guest Speaker</td><td>:</td><td>'+data['guestSpeaker']+'</td></tr>'+
							'<tr><td>Tempat</td><td>:</td><td>'+data['tempatPertemuan']+'</td></tr>'+
							'<tr><td>No WA</td><td>:</td><td>'+data['noWa']+'</td></tr>'+
						'</div>'+
					'</ons-list-item>'
				);
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function flip() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'flip.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				const html = '<a href="'+base_url2+'assets/img/flipchart/'+data['fotoFlipChart']+'" class="js-img-viwer" data-caption="'+data['namaFlipChart']+'" data-id="'+data['idFlipChart']+'">'+
							'<img src="'+base_url2+'assets/img/flipchart/'+data['fotoFlipChart']+'" alt="">'+
							'</a>';
				$('#list-flip').append(html);
			});
			$(".js-img-viwer").SmartPhoto();
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function persentasi() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'persentasi.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-persentasi').append(
					'<ons-list-item modifier="longdivider chevron" tappable onclick="persentasi_detail('+"'"+data['linkPersentasi']+"'"+');">'+
					'<div class="center"><span class="list-item__title">'+data['namaPersentasi']+'</span><span class="list-item__subtitle">'+data['deskripsiPersentasi']+'</span></div>'+
					'</ons-list-item>'
				);
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function persentasi_detail(idVideo) {
	console.log(idVideo);
	try {
		window.InAppYouTube.openVideo(idVideo, {
			fullscreen: true
		}, function(result) {
			console.log(JSON.stringify(result));
		}, function(reason) {
			console.log(reason);
		});
	} catch(e) {}
}

function persentasi_reset() {
	myPage.resetToPage('page/persentasi.html', {animation:'fade'});
}

function plan() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'plan.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		console.log(result);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data']['deskripsi'], function (d, data) {
				$('#deskripsiPlan').append(data['deskripsiMarketing']);
			});
			$.each(result['data']['img'], function (d, data) {
				const html = 
				'<a href="'+base_url2+'assets/img/marketingplan/'+data['foto']+'" class="js-img-viwer" data-caption="'+data['idMarketing']+'" data-id="'+data['idFoto']+'">'+
					'<img src="'+base_url2+'assets/img/marketingplan/'+data['foto']+'" alt="">'+
				'</a>';
				$('#fotoPlan').append(html);
			});
			$(".js-img-viwer").SmartPhoto();
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function basic() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'basicpack.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-basic').append(
					'<ons-list-item modifier="longdivider chevron" tappable onclick="basic_detail('+"'"+data['linkYoutube']+"'"+');">'+
					'<div class="center"><span class="list-item__title">'+data['namaBasicPack']+'</span><span class="list-item__subtitle">'+data['deskripsiBasicPack']+'</span></div>'+
					'</ons-list-item>'
				);
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function basic_detail(idVideo) {
	console.log(idVideo);
	try {
		window.InAppYouTube.openVideo(idVideo, {
			fullscreen: true
		}, function(result) {
			console.log(JSON.stringify(result));
		}, function(reason) {
			console.log(reason);
		});
	} catch(e) {}
}

function testimoni() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'testimoni.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-testimoni').append(
					'<ons-list-item modifier="longdivider chevron" tappable onclick="testimoni_detail('+"'"+data['linkTestimoni']+"'"+');">'+
					'<div class="center"><span class="list-item__title">'+data['namaTestimoni']+'</span><span class="list-item__subtitle">'+data['deskripsiTestimoni']+'</span></div>'+
					'</ons-list-item>'
				);
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}

function testimoni_detail(idVideo) {
	console.log(idVideo);
	try {
		window.InAppYouTube.openVideo(idVideo, {
			fullscreen: true
		}, function(result) {
			console.log(JSON.stringify(result));
		}, function(reason) {
			console.log(reason);
		});
	} catch(e) {}
}

function order_cart() {
	consumer_keyup();

	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'cart.json?id_plm='+localStorage.getItem('id_plm'), true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==false) {
			$('#form-trs').hide();
			$('#btn-order-byr').hide();
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$('#form-trs').show();
			$('#btn-order-byr').show();
			$.each(result['data'], function (d, data) {
				$('#list-cart').append(
					'<ons-list-item modifier="longdivider" onclick="ubah_cart('+"'"+data['id_cart']+"'"+')">'+
						'<table>'+
							'<tr>'+
								'<td>Produk</td>'+
								'<td>:</td>'+
								'<td>'+data['namaProduk']+'</td>'+
							'</tr>'+
							'<tr>'+
								'<td>Harga</td>'+
								'<td>:</td>'+
								'<td>'+formatRupiah(data['hargaProduk'], 'Rp. ')+'</td>'+
							'</tr>'+
							'<tr>'+
								'<td>Qty</td>'+
								'<td>:</td>'+
								'<td>'+data['qty_cart']+'</td>'+
							'</tr>'+
							'<tr>'+
								'<td>Total Harga</td>'+
								'<td>:</td>'+
								'<td>'+formatRupiah(data['total_cart'], 'Rp. ')+'</td>'+
							'</tr>'+
							'<tr>'+
								'<td>&nbsp;</td>'+
							'</tr>'+
						'</table>'+
					'</ons-list-item>'
				);
			});
			$('#list-cart').append(
				'<ons-list-item modifier="longdivider">'+
					'<b><table>'+
						'<tr>'+
							'<td>Total Bayar</td>'+
							'<td>:</td>'+
							'<td>'+
								'<table>'+
									'<tr>'+
										'<td><input type="number" name="total_bayar" id="total_bayar" class="form-control" readonly value="'+result['total']['total_bayar']+'"></td>'+
									'</tr>'+
								'</table>'+
							'</td>'+
						'</tr>'+
					'</table></b>'+
				'</ons-list-item>'
			);

			$('#bayarkeun').click(function () {
				const consumer = 
					'id_plm='+localStorage.getItem("id_plm")+
					'&order_nama_penerima='+$('#order_nama_penerima').val()+
					'&order_alamat_penerima='+$('#order_alamat_penerima').val()+
					'&order_nowa_penerima='+$('#order_nowa_penerima').val()+
					'&total_bayar='+$('#total_bayar').val();
				if ($('#order_nama_penerima').val() != "" && $('#order_alamat_penerima').val() != "" && $('#order_nowa_penerima').val() != "") {
					xhr.onloadstart = function () {
				        $('ons-modal').show();
				    }
					xhr.open("POST", url_api + 'order.json', true);
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xhr.onload = function () {
						const result = JSON.parse(this.responseText);
						console.log(result);
						$('ons-modal').hide();
						if (result['status']==true) {
							localStorage.setItem('order_nama_penerima' , "");
							localStorage.setItem('order_alamat_penerima' , "");
							localStorage.setItem('order_nowa_penerima' , "");
							myPage.resetToPage('page/order_confirm.html', {animation:'fade'}).then(function () {
								ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
							});
						}else{
							ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
						}
					};
					xhr.send(consumer);
					return false;
				}else{
					ons.notification.toast('Masukan data penerima terlebih dahulu', { timeout: 2000, animation: 'ascend' });
				}
			});

			$('#batalkeun').click(function () {
				const idSales = 
					'id_plm='+localStorage.getItem("id_plm");
				xhr.onloadstart = function () {
			        $('ons-modal').show();
			    }
				xhr.open("POST", url_api + 'cartdeleteall.json', true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.onload = function () {
					const result = JSON.parse(this.responseText);
					console.log(result);
					$('ons-modal').hide();
					if (result['status']==true) {
						myPage.resetToPage('page/beranda.html', {animation:'fade'}).then(function () {
							ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
						});
					}else{
						ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
					}
				};
				xhr.send(idSales);
				return false;
			});
		}
	};
	xhr.send();
	return false;
}

function ubah_cart(id_cart) {
	myPage.resetToPage('page/order_produk_edit.html', {animation:'fade'}).then(function () {
		$('#id-cart-edit').val(id_cart);
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
			$('ons-modal').show();
		}
		xhr.open("GET", url_api + 'cart.json?idCart='+id_cart, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			$('#select-order-edit').val(result['data']['idProduk']);
			select_order_edit(result['data']['idProduk'], result['data']['qty_cart'], result['data']['total_cart']);
			order_produk_onchange_edit();
			$('#btn-produk-hps').click(function () {
				delete_produk(result['data']['id_cart']);
			});
			$('#btn-produk-edit').click(function () {
				const data = 
					"idCart="+ result['data']['id_cart'] +
					"&id_plm="+ localStorage.getItem('id_plm') +
					"&idProduk="+ $('#select-order-edit').val() +
					"&qty_cart="+ $('#produk-qty-edit').val() +
					"&total_cart="+ $('#produk-total-edit').val();

				if ($('#select-order-edit').val() !== "" && $('#produk-qty-edit').val() !== "" && $('#produk-total-edit').val() !== 0) {
					const xhr = new XMLHttpRequest();
					xhr.onloadstart = function () {
			            $('ons-modal').show();
			            $('#page-order-produk-hide-edit').addClass('invisible');
			        }
					xhr.open("POST", url_api + 'cartedit.json', true);
					xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
					xhr.onload = function () {
						const result = JSON.parse(this.responseText);
						console.log(result);
						$('ons-modal').hide();
						if (result['status']==true) {
							myPage.resetToPage('page/order.html', {animation:'fade'}).then(function () {
								ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
							});
						}else{
							ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
						}
					};
					xhr.send(data);
					return false;
				}else{
					ons.notification.toast('Lengkapi detail orderan Anda', { timeout: 2000, animation: 'ascend' });
				}
			});
		}
		xhr.send();
		return false;

	});

	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'produk_all.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#select-order-edit').append(
					$('<option></option>').attr({"value":data['idProduk']}).text(data['namaProduk'])
				);
			});
		}
	};
	xhr.send();
	return false;
}

function select_order_edit(idProduk, qty_awal, total_awal) {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'produk_all.json?idProduk='+idProduk, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function (event) {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		$('#produk-qty-edit').html('<option value="">Pilih jumlah Qty</option>');
		$('#produk-total-edit').val(0);
		event.preventDefault();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$('#tb-produk-detail-edit').html(
				'<table width="100%">'+
					'<tr>'+
						'<td>Nama</td>'+
						'<td>:</td>'+
						'<td>'+result['data']['namaProduk']+'</td>'+
					'<tr>'+
					'<tr>'+
						'<td>Harga</td>'+
						'<td>:</td>'+
						'<td>'+formatRupiah(result['data']['hargaProduk'], 'Rp. ')+'</td>'+
					'<tr>'+
					'<tr>'+
						'<td>Stok</td>'+
						'<td>:</td>'+
						'<td>'+result['data']['stokProduk']+'</td>'+
					'<tr>'+
				'</table>'
			);
			for (i = 1; i <= result['data']['stokProduk']; i++) {
				$('#produk-qty-edit').append(
					$('<option></option>').attr({"value":i}).text(i)
				);
			}

			$('#produk-qty-edit').val(qty_awal);
			$('#produk-total-edit').val(total_awal);

			$('#produk-qty-edit').change(function () {
				$('#produk-total-edit').val(parseInt($('#produk-qty-edit').val())*parseInt(result['data']['hargaProduk']));
			});
		}
	};
	xhr.send();
	return false;
}

function order_produk_onchange_edit() {
	$('#select-order-edit').change(function () {
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("GET", url_api + 'produk_all.json?idProduk='+$('#select-order-edit').val(), true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function (event) {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			$('#produk-qty-edit').html('<option value="">Pilih jumlah Qty</option>');
			$('#produk-total-edit').val(0);
			event.preventDefault();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
			}else{
				$('#tb-produk-detail-edit').html(
					'<table width="100%">'+
						'<tr>'+
							'<td>Nama</td>'+
							'<td>:</td>'+
							'<td>'+result['data']['namaProduk']+'</td>'+
						'<tr>'+
						'<tr>'+
							'<td>Harga</td>'+
							'<td>:</td>'+
							'<td>'+formatRupiah(result['data']['hargaProduk'], 'Rp. ')+'</td>'+
						'<tr>'+
						'<tr>'+
							'<td>Stok</td>'+
							'<td>:</td>'+
							'<td>'+result['data']['stokProduk']+'</td>'+
						'<tr>'+
					'</table>'
				);
				for (i = 1; i <= result['data']['stokProduk']; i++) {
					$('#produk-qty-edit').append(
						$('<option></option>').attr({"value":i}).text(i)
					);
				}
				$('#produk-qty-edit').change(function () {
					$('#produk-total-edit').val(parseInt($('#produk-qty-edit').val())*parseInt(result['data']['hargaProduk']));
				});
			}
		};
		xhr.send();
		return false;
	});
}

function ubah_total() {
	$('#total_bayar').attr("readonly", false);
}

function consumer_keyup() {
	$('#order_nama_penerima').keyup(function () {
		localStorage.setItem('order_nama_penerima' ,$('#order_nama_penerima').val());
	});
	$('#order_nowa_penerima').keyup(function () {
		localStorage.setItem('order_nowa_penerima' ,$('#order_nowa_penerima').val());
	});
	$('#order_alamat_penerima').keyup(function () {
		localStorage.setItem('order_alamat_penerima' ,$('#order_alamat_penerima').val());
	});
}

function delete_produk(idCart) {
	const xhr = new XMLHttpRequest();
	const data = "idCart="+idCart;
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("POST", url_api + 'cartdelete.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==true) {
			myPage.resetToPage('page/order.html', {animation:'fade'}).then(function () {
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			});
		}else{
			ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send(data);
	return false;
}

function order_produk() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'produk_all.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#select-order').append(
					$('<option></option>').attr({"value":data['idProduk']}).text(data['namaProduk'])
				);
			});
			// $("#select-order").imagepicker();
		}
	};
	xhr.send();
	return false;
}

function order_produk_onchange(){
	$('#select-order').change(function () {
		const xhr = new XMLHttpRequest();
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("GET", url_api + 'produk_all.json?idProduk='+$('#select-order').val(), true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function (event) {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			$('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
			$('#produk-total').val(0);
			event.preventDefault();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
			}else{
				$('#tb-produk-detail').html(
					'<table width="100%">'+
						'<tr>'+
							'<td>Nama</td>'+
							'<td>:</td>'+
							'<td>'+result['data']['namaProduk']+'</td>'+
						'<tr>'+
						'<tr>'+
							'<td>Harga</td>'+
							'<td>:</td>'+
							'<td>'+formatRupiah(result['data']['hargaProduk'], 'Rp. ')+'</td>'+
						'<tr>'+
						'<tr>'+
							'<td>Stok</td>'+
							'<td>:</td>'+
							'<td>'+result['data']['stokProduk']+'</td>'+
						'<tr>'+
					'</table>'
				);
				for (i = 1; i <= result['data']['stokProduk']; i++) {
					$('#produk-qty').append(
						$('<option></option>').attr({"value":i}).text(i)
					);
				}
				$('#produk-qty').change(function () {
					$('#produk-total').val(parseInt($('#produk-qty').val())*parseInt(result['data']['hargaProduk']));
				});
			}
		};
		xhr.send();
		return false;
	});
	$('.btn-produk-bayar').click(function () {
		const btn = $(this).data('id');
		if ($('#select-order').val() !== "" && $('#produk-qty').val() !== "" && $('#produk-total').val() !== 0) {
			const xhr = new XMLHttpRequest();
			const data = "id_plm="+localStorage.getItem('id_plm')+"&idProduk="+$('#select-order').val()+"&qty_cart="+$('#produk-qty').val()+"&total_cart="+$('#produk-total').val();
			xhr.onloadstart = function () {
	            $('ons-modal').show();
	            $('#page-order-produk-hide').addClass('invisible');
	        }
			xhr.open("POST", url_api + 'cart.json', true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				const result = JSON.parse(this.responseText);
				$('ons-modal').hide();
				if (result['status']==true) {
					if (btn == 1) {
						myPage.resetToPage('page/order.html', {animation:'fade'}).then(function () {
							ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
						});
					}else{
						myPage.resetToPage('page/order.html', {animation:'fade'}).then(function () {
							myPage.resetToPage('page/order_produk.html', {animation:'fade'});
						});
					}
				}
			};
			xhr.send(data);
			return false;
		}else{
			ons.notification.toast('Lengkapi detail orderan Anda', { timeout: 2000, animation: 'ascend' });
		}
	});
}

function addLocal_consumer() {
	localStorage.setItem('order_nama_penerima' ,$('#order_nama_penerima').val());
	localStorage.setItem('order_alamat_penerima' ,$('#order_alamat_penerima').val());
	localStorage.setItem('order_nowa_penerima' ,$('#order_nowa_penerima').val());
}

function getLocal_consumer() {
	$('#order_nama_penerima').val(localStorage.getItem('order_nama_penerima'));
	$('#order_alamat_penerima').val(localStorage.getItem('order_alamat_penerima'));
	$('#order_nowa_penerima').val(localStorage.getItem('order_nowa_penerima'));
}

function order_confirm() {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'list_order_status.json?idSales='+localStorage.getItem('id_plm'), true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']) {
			$.each(result['data']['status_0'], function (d, data) {
				$('#list-orederan-saya-0').append(
					'<ons-list-item modifier="longdivider chevron" onclick="moveToOrderUpload('+"'"+data['id_order']+"'"+')">'+
						'<div class="center">'+
							'<table>'+
								'<tr>'+
									'<td>Code</td>'+
									'<td>:</td>'+
									'<td>'+data['id_order']+'</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Nama</td>'+
									'<td>:</td>'+
									'<td>'+data['nama_penerima']+'</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Total</td>'+
									'<td>:</td>'+
									'<td>'+data['total_order']+'</td>'+
								'</tr>'+
							'</table>'+
						'</div>'+
					'</ons-list-item>'
				);
			});
			$.each(result['data']['status_1'], function (d, data) {
				$('#list-orederan-saya-1').append(
					'<ons-list-item modifier="longdivider" expandable>'+
						'<p>'+data['id_order']+'</p>'+
						'<div class="expandable-content">'+
							'<table>'+
								'<tr>'+
									'<td>Nama</td>'+
									'<td>:</td>'+
									'<td>'+data['nama_penerima']+'</td>'+
								'</tr>'+
								'<tr>'+
									'<td>Total</td>'+
									'<td>:</td>'+
									'<td>'+data['total_order']+'</td>'+
								'</tr>'+
							'</table>'+
						'</div>'+
					'</ons-list-item>'
				);
			});
		}
	};
	xhr.send();
	return false;
}

function moveToOrderUpload(idOrder) {
	localStorage.setItem('idOrderUP', idOrder);
	myPage.resetToPage('page/order_confirm_upload.html', {animation:'slide'});
}

function order_confirm_upload() {
	$('#upload-id-order').val(localStorage.getItem('idOrderUP'));
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'bank_admin.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==true) {
			$.each(result['data'], function (d, data) {
				$('#upload-id-bank').append(
					$('<option></option>').attr({"value":data['id_bank']}).text(data['nama_bank'])
				);
			});
			$('#upload-id-bank').change(function () {
				xhr.onloadstart = function () {
			        $('ons-modal').show();
			    }
				xhr.open("GET", url_api + 'bank_admin.json?idBank='+$('#upload-id-bank').val(), true);
				xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xhr.onload = function () {
					const result = JSON.parse(this.responseText);
					$('ons-modal').hide();
					$('#upload-norek-order').val(result['data']['norek_bank']);
					$('#upload-an-order').val(result['data']['an_bank']);

					if ($('#upload-id-bank').val() == 4) {
						$('#if-cod').removeClass('invisible');
						$('#if-bank').addClass('invisible');
					}else{
						$('#if-bank').removeClass('invisible');
						$('#if-cod').addClass('invisible');
					}
				}
				xhr.send();
				return false;
			});
		}
	}
	xhr.send();

	$('#upByCamera').click(function () {
		if ($('#upload-id-bank').val() !== "") {
			navigator.camera.getPicture(onSuccess, onFail, { quality: 25,
		        destinationType: Camera.DestinationType.DATA_URL
		    });
		}else{
			ons.notification.toast('Silahkan pilih akun bank terlebih dahulu', { timeout: 2000, animation: 'ascend' });
		}
	});
	$('#upByGalery').click(function () {
		if ($('#upload-id-bank').val() !== "") {
			navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
                allowEdit: false,
                destinationType: Camera.DestinationType.DATA_URL
            });
		}else{
			ons.notification.toast('Silahkan pilih akun bank terlebih dahulu', { timeout: 2000, animation: 'ascend' });
		}
	});
	$('#upByCOD').click(function () {
		if ($('#upload-id-bank').val() !== "") {
			onSuccess('-');
		}else{
			ons.notification.toast('Silahkan pilih COD untuk mengonfirmasi', { timeout: 2000, animation: 'ascend' });
		}
	});

	function onSuccess(imageData) {
    	const data = 
    		"orderID="+ localStorage.getItem('idOrderUP') +
    		"&idBank="+ $('#upload-id-bank').val() +
    		"&fotoBukti="+ imageData;
    	const xhr = new XMLHttpRequest();
    	xhr.onloadstart = function () {
            $('ons-modal').show();
			setTimeout(function(){
				$('ons-modal').hide();
				ons.notification.toast('Koneksi anda tidak stabil, silahkan ulangi beberapa saat lagi', { timeout: 5000, animation: 'ascend' });
			}, 180000);
        }
		xhr.open("POST", url_api + 'upload_bukti.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			console.log(result);
			// $('ons-modal').hide();
			// if (result['status']==true) {
			// 	ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' }).then(function () {
			// 		page_bukti($('#upload-id-bank').val(), localStorage.getItem('idOrderUP'));
			// 	});
			// }else{
			// 	ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' });
			// }
		};
		xhr.send(data);
		return false;
    }

    function onFail(message) {
        ons.notification.toast('Gagal karena '+message, { timeout: 2000, animation: 'ascend' });
    }
	return false;
}

function page_bukti(idBank, idOrder) {
	console.log(idBank +' '+ idOrder);
	myPage.resetToPage('page/order_confirm_bukti.html', {animation:'fade'}).then(function () {
		if (idBank == 4) {
			$('#img-bukti-transfer').attr('src', base_url+'assets/img/bukti/cod.jpg');
		}else{
			$('#img-bukti-transfer').attr('src', base_url+'assets/img/bukti/'+ idOrder.replace("/", "_")+'.jpg');
		}
		$('#screenshoot-bukti').click(function () {
			navigator.screenshot.save(function(error,res){
				if(error){
					console.log(error);
					myPage.resetToPage('page/order_confirm.html', {animation:'fade'}).then(function () {
						ons.notification.toast('Screenshot error perangkat anda tidak mendukung ', { timeout: 2000, animation: 'ascend' });
					});
				}else{
					myPage.resetToPage('page/order_confirm.html', {animation:'fade'}).then(function () {
						ons.notification.toast('Screenshot berhasil disimpan di Galeri', { timeout: 2000, animation: 'ascend' });
					});
				}
			});
		});
	});
}

function keluar() {
	ons.notification.confirm('Apakah Anda yakin akan keluar?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
		if (index==0) {
			window.localStorage.clear();
			myPage.resetToPage('page/login.html', {animation:'fade'});
		}
	});
}
function info_pin() {
	ons.notification.confirm('Minta PIN ke Admin?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
		if (index==0) {
			window.plugins.socialsharing.shareViaWhatsAppToPhone('+6282113122700', 'Hallo Admin, saya minta PIN untuk login', null /* img */, null /* url */, function() {console.log('share ok')})
		}
	});
}

function back_button(page) {
	ons.setDefaultDeviceBackButtonListener(function() {
		myPage.resetToPage('page/'+page, {animation:'slide'});
	});
}

function exit_app() {
	ons.setDefaultDeviceBackButtonListener(function() {
		navigator.app.exitApp();
	});
}

function moveOnDelete() {
	$('#pin-2').keyup(function (ev) {
		const keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if (keycode == 8 || keycode == 46) {
			document.getElementById('pin-1').focus();
		}
	});
	$('#pin-3').keyup(function (ev) {
		const keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if (keycode == 8 || keycode == 46) {
			document.getElementById('pin-2').focus();
		}
	});
	$('#pin-4').keyup(function (ev) {
		const keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if (keycode == 8 || keycode == 46) {
			document.getElementById('pin-3').focus();
		}
	});
	$('#pin-5').keyup(function (ev) {
		const keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if (keycode == 8 || keycode == 46) {
			document.getElementById('pin-4').focus();
		}
	});
	$('#pin-6').keyup(function (ev) {
		const keycode = (ev.keyCode ? ev.keyCode : ev.which);
		if (keycode == 8 || keycode == 46) {
			document.getElementById('pin-5').focus();
		}
	});
}
function formatRupiah(angka, prefix){
	if (angka != null) {
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
		split   		= number_string.split(','),
		sisa     		= split[0].length % 3,
		rupiah     		= split[0].substr(0, sisa),
		ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

		// tambahkan titik jika yang di input sudah menjadi angka ribuan
		if(ribuan){
			separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}

		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
	}
}
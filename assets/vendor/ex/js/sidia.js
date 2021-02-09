moment.locale('id');
const base_url = 'https://ruangmember.kadetech.tech/';
const url_api = 'https://ruangmember.kadetech.tech/api/';
const storage = window.localStorage;
const fade = {animation:'fade'};
const xhr = new XMLHttpRequest();
document.addEventListener("deviceready", onReady, false);
// onReady();
function onReady () {
	document.addEventListener('init', onsenUI);
}
function onsenUI (event) {
	const page = event.target;
	if (page.matches('#page-loading')) {
		if ((getStorage('id_plm') != undefined && getStorage('id_plm') != null && getStorage('id_plm') != "") || (getStorage('id_sementara') != undefined && getStorage('id_sementara') != null && getStorage('id_sementara') != "")) {
			myPage.resetToPage('page/pin.html', fade);
		}else{
			myPage.resetToPage('page/login.html', fade);
		}
	}else if(page.matches('#page-pin')){
		document.getElementById('pin-1').focus();
		moveOnMax = function (field, nextFieldID) {
			if ($(field).val().length == 1) {
				document.getElementById(nextFieldID).focus();
			}
		}
		moveOnDelete();
		cekPIN();
		exitApp();
	}else if (page.matches('#page-login')) {
		loginPage();
		exitApp();
	}else if (page.matches('#page-lupa')) {
		sendAktivasi();
		backButton('login.html');
	}else if (page.matches('#page-register')) {
		pendaftaran();
		backButton('login.html');
	}else if (page.matches('#page-beranda')) {
		photoPromosi();
		exitApp();
	}else if (page.matches('#page-basic')) {
		backButton('beranda.html');
	}else if (page.matches('#page-persentasi')) {
		backButton('beranda.html');
	}else if (page.matches('#page-order-confirm-bukti')) {
		backButton('beranda.html');
	}else if (page.matches('#page-order-confirm-upload')) {
		backButton('report_bs.html');
	}else if (page.matches('#page-pertemuan')) {
		pertemuan();
		backButton('beranda.html');
	}else if (page.matches('#page-pertemuan-detail')) {
		backButton('pertemuan.html');
	}else if (page.matches('#page-flip')) {
		flip();
		backButton('beranda.html');
	}else if (page.matches('#page-standar')) {
		backButton('beranda.html');
	}else if (page.matches('#page-plan')) {
		plan();
		backButton('beranda.html');
	}else if (page.matches('#page-produk')) {
		produkAll();
		backButton('beranda.html');
	}else if (page.matches('#page-order')) {
		cartAll();
		backButton('beranda.html');
	}else if (page.matches('#page-order-produk')) {
		orderProduk();
		backButton('order.html');
	}else if (page.matches('#page-order-bayar')) {
		pageBayarAll();
		backButton('order.html');
	}else if (page.matches('#page-report')) {
		backButton('beranda.html');
	}else if (page.matches('#page-testimoni')) {
		backButton('beranda.html');
	}else if (page.matches('#page-report-bs')) {
		initRBS();
		getRBS();
		searchBS();
		backButton('report.html');
	}else if (page.matches('#page-order-confirm-upload')) {
		backButton('report-bs.html');
	}else if (page.matches('#page-report-dp')) {
		initRDP();
		backButton('report.html');
	}else if (page.matches('#page-report-dk')) {
		initRDK();
		backButton('report.html');
	}else if (page.matches('#page-report-selesai')) {
		initRS();
		backButton('report.html');
	}else if (page.matches('#page-report-komisi')) {
		initKomisi();
		backButton('report.html');
	}else if (page.matches('#page-profile')) {
		profile_update();
		backButton('pengaturan.html');
	}else if (page.matches('#page-bank')) {
		bank_update();
		backButton('pengaturan.html');
	}else{
		backButton('beranda.html');
	}
}

// Sebelum Beranda //
cekPIN = function () {
	$('#pin-6').keyup(function () {
		const idSales = (getStorage('id_plm') ? getStorage('id_plm') : getStorage('id_sementara'));
		const sales = `idSales=${idSales}&pin=${$('#pin-1').val()+$('#pin-2').val()+$('#pin-3').val()+$('#pin-4').val()+$('#pin-5').val()+$('#pin-6').val()}`;
		xhr.open("POST", url_api + 'cek_pin.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			if (result['status']==true) {
				setStorage('id_plm', result['data']['id_plm']);
				myPage.resetToPage('page/beranda.html', fade);
			}else{
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send(sales);
		return false;
	});
}

pendaftaran = function () {
	$('#btnRegister').click(function () {
		if ($('#register-id').val() !== "" && $('#register-nama').val() !== "" && $('#register-nowa').val() !== "" && $('#register-password').val() !== "" && $('#register-password-ulangi').val() !== "") {
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
		}else{
			ons.notification.toast('Form tidak boleh ada yang kosong', { timeout: 1000, animation: 'ascend' });
		}
	});
}

loginPage = function () {
	$('#btnMasuk').click(function () {
		const data = `login-id=${$('#login-id').val()}&login-password=${$('#login-password').val()}`;
		if ($('#login-id').val() !== "" && $('#login-password').val() !== "") {
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
						myPage.resetToPage('page/pin.html', fade);
					}
				});
			};
			xhr.send(data);
			return false;
		}else{
			ons.notification.toast('Silahkan isi ID & Password Anda', { timeout: 1500, animation: 'ascend' });
		}
	});
}

sendAktivasi = function () {
	function delay(callback, ms) {
		var timer = 0;
		return function() {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				callback.apply(context, args);
			}, ms || 0);
		};
	}
	$('#lupa-id').keyup(delay(function (e) {
		const data = `lupa-id=${$('#lupa-id').val()}`;
		xhr.onloadstart = function () {
            $('ons-modal').show();
            var waktu = 60;
			setInterval(function() {
				waktu--;
				if(waktu < 0) {
					$('#countWA').html(' ');
				}else{
					$('#countWA').html(`dalam ${waktu} detik`);
				}
			}, 1000);
        }
		xhr.open("POST", url_api + 'aktivasi.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send(data);
		return false;
	}, 1500));
}
reSendAktivasi = function () {
	if ($('#lupa-id').val() !== "") {
		const data = `lupa-id=${$('#lupa-id').val()}`;
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST", url_api + 'aktivasi.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send(data);
		return false;
	}else{
		ons.notification.toast('Isi terlebih dahulu ID PLM Anda', { timeout: 2000, animation: 'ascend' });
	}
}

kirimPassword = function () {
	if ($('#lupa-id').val() !== "" && $('#lupa-kode').val() !== "") {
		const data = `lupa-id=${$('#lupa-id').val()}&lupa-kode=${$('#lupa-kode').val()}`;
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST", url_api + 'kirim_password.json', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==true) {
				myPage.resetToPage('page/login.html', fade).then(function () {
					ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
				});
			}else{
				ons.notification.toast(result['message'], { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send(data);
		return false;
	}else{
		ons.notification.toast('Isi terlebih dahulu ID PLM & Kode Aktivasi Anda', { timeout: 2000, animation: 'ascend' });
	}
}

// Beranda //
photoPromosi = function () {
	xhr.open("GET", url_api + 'promosi.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$.each(result['data'], function (d, data) {
			$('#my-slide').append(`<div><img src="${base_url}assets/img/promosi/${data['fotoPromosi']}" class="img-responsive" alt="" /></div>`);
		});
		$('#my-slide').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			autoplay: true,
			autoplaySpeed: 5000,
		});
	};
	xhr.send();
	return false;
}

// Persentasi, Standar, Basic Pack, Testimoni. API YouTube //
standarAll = function (pageToken="") {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-standar').empty();
        $('#lm-standar').empty();
    }
	xhr.open("GET", url_api + `persentasi_standar.json?pageToken=${pageToken}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		$.each(result['data'], function (d, data) {
			$('#list-standar').append(
				`
				<div class="card card2" onclick="openVideo('${data.id}');">
					<img src="${data['thumbnail']}" class="img-responsive" alt="">
					<p class="text-list-yt">${data['title']}</p>
				</div>
				`
			);
		});
		if (result.page.total > 5) {
			if (result.page.prev == null) {
				$('#lm-standar').append(
					`<button type="button" class="btn btn-bg btn-full" onclick="standarAll('${result.page.next}')">
						Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
					</button>`
				);
			}else if (result.page.prev != null && result.page.next == null) {
				$('#lm-standar').append(
					`<button type="button" class="btn bg-white btn-full" onclick="standarAll('${result.page.prev}')">
						<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
					</button>`
				);
			}else if (result.page.prev != null && result.page.next != null) {
				$('#lm-standar').append(
					`<ons-row>
						<ons-col>
							<button type="button" class="btn btn-full bg-white" onclick="standarAll('${result.page.prev}')">
								<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
							</button>
						</ons-col>
						<ons-col>
							<button type="button" class="btn btn-bg btn-full" onclick="standarAll('${result.page.next}')">
								Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
							</button>
						</ons-col>
					</ons-row>`
				);
			}
		}
	};
	xhr.send();
	return false;
}
persentasiAll = function (pageToken="") {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-persentasi').empty();
        $('#lm-persentasi').empty();
    }
	xhr.open("GET", url_api + `persentasi.json?pageToken=${pageToken}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		$.each(result['data'], function (d, data) {
			$('#list-persentasi').append(
				`
				<div class="card card2" onclick="openVideo('${data.id}');">
					<img src="${data['thumbnail']}" class="img-responsive" alt="">
					<p class="text-list-yt">${data['title']}</p>
				</div>
				`
			);
		});
		if (result.page.total > 5) {
			if (result.page.prev == null) {
				$('#lm-persentasi').append(
					`<button type="button" class="btn btn-bg btn-full" onclick="persentasiAll('${result.page.next}')">
						Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
					</button>`
				);
			}else if (result.page.prev != null && result.page.next == null) {
				$('#lm-persentasi').append(
					`<button type="button" class="btn bg-white btn-full" onclick="persentasiAll('${result.page.prev}')">
						<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
					</button>`
				);
			}else if (result.page.prev != null && result.page.next != null) {
				$('#lm-persentasi').append(
					`<ons-row>
						<ons-col>
							<button type="button" class="btn btn-full bg-white" onclick="persentasiAll('${result.page.prev}')">
								<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
							</button>
						</ons-col>
						<ons-col>
							<button type="button" class="btn btn-bg btn-full" onclick="persentasiAll('${result.page.next}')">
								Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
							</button>
						</ons-col>
					</ons-row>`
				);
			}
		}
	};
	xhr.send();
	return false;
}
basicPackAll = function (pageToken="") {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-basicpack').empty();
        $('#lm-basicpack').empty();
    }
	xhr.open("GET", url_api + `basicpack.json?pageToken=${pageToken}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		$.each(result['data'], function (d, data) {
			$('#list-basicpack').append(
				`
				<div class="card card2" onclick="openVideo('${data.id}');">
					<img src="${data['thumbnail']}" class="img-responsive" alt="">
					<p class="text-list-yt">${data['title']}</p>
				</div>
				`
			);
		});
		if (result.page.total > 5) {
			if (result.page.prev == null) {
				$('#lm-basicpack').append(
					`<button type="button" class="btn btn-bg btn-full" onclick="basicPackAll('${result.page.next}')">
						Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
					</button>`
				);
			}else if (result.page.prev != null && result.page.next == null) {
				$('#lm-basicpack').append(
					`<button type="button" class="btn bg-white btn-full" onclick="basicPackAll('${result.page.prev}')">
						<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
					</button>`
				);
			}else if (result.page.prev != null && result.page.next != null) {
				$('#lm-basicpack').append(
					`<ons-row>
						<ons-col>
							<button type="button" class="btn btn-full bg-white" onclick="basicPackAll('${result.page.prev}')">
								<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
							</button>
						</ons-col>
						<ons-col>
							<button type="button" class="btn btn-bg btn-full" onclick="basicPackAll('${result.page.next}')">
								Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
							</button>
						</ons-col>
					</ons-row>`
				);
			}
		}
	};
	xhr.send();
	return false;
}
testimoniAll = function (pageToken="") {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-testimoni').empty();
        $('#lm-testimoni').empty();
    }
	xhr.open("GET", url_api + `testimoni.json?pageToken=${pageToken}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		$.each(result['data'], function (d, data) {
			$('#list-testimoni').append(
				`
				<div class="card card2" onclick="openVideo('${data.id}');">
					<img src="${data['thumbnail']}" class="img-responsive" alt="">
					<p class="text-list-yt">${data['title']}</p>
				</div>
				`
			);
		});
		if (result.page.total > 5) {
			if (result.page.prev == null) {
				$('#lm-testimoni').append(
					`<button type="button" class="btn btn-bg btn-full" onclick="testimoniAll('${result.page.next}')">
						Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
					</button>`
				);
			}else if (result.page.prev != null && result.page.next == null) {
				$('#lm-testimoni').append(
					`<button type="button" class="btn bg-white btn-full" onclick="testimoniAll('${result.page.prev}')">
						<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
					</button>`
				);
			}else if (result.page.prev != null && result.page.next != null) {
				$('#lm-testimoni').append(
					`<ons-row>
						<ons-col>
							<button type="button" class="btn btn-full bg-white" onclick="testimoniAll('${result.page.prev}')">
								<i class="fa fa-arrow-left"></i> Halaman Sebelumnya
							</button>
						</ons-col>
						<ons-col>
							<button type="button" class="btn btn-bg btn-full" onclick="testimoniAll('${result.page.next}')">
								Halaman Selanjutnya <i class="fa fa-arrow-right"></i>
							</button>
						</ons-col>
					</ons-row>`
				);
			}
		}
	};
	xhr.send();
	return false;
}

// Produk, Pertemuan, Flip Chart, Marketing Plan.
pertemuan = function () {
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
					`<ons-list-item modifier="longdivider" tappable onclick="pertemuanDetail('${data['houseCouple']}', '${data['guestSpeaker']}', '${data['tempatPertemuan']}', '${data['noWa']}')">
						<div class="left">
							<img class="list-item__thumbnail" src="vendor/img/pertemuan.png">
						</div>
						<div class="center">
							<span class="list-item__title">
								${data['namaPertemuan']}
							</span>
							<span class="list-item__subtitle">
								Tanggal ${moment(data['tanggalPertemuan'], "YYYY-MM-DD HH:mm:ss").format('DD MMMM YYYY | HH:mm')} WIB
							</span>
						</div>
					</ons-list-item>`
				);
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}
pertemuanDetail = function (hc, gs, tempat, nowa) {
	myPage.resetToPage('page/pertemuan_detail.html', fade).then(function () {
		$('#rslt-pertemuan-hc').html(hc);
		$('#rslt-pertemuan-gs').html(gs);
		$('#rslt-pertemuan-tempat').html(tempat);
		$('#rslt-pertemuan-nowa').html(nowa);
	});
}
flip = function (page=0) {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-flip').empty();
    }
	xhr.open("GET", `${url_api}flip.json?page=${page}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		console.log(result);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-flip').append(
					`<a href="${base_url}assets/img/flipchart/${data['fotoFlipChart']}" class="js-img-viwer" data-caption="${data['namaFlipChart']}" data-id="${data['idFlipChart']}">
						<img src="${base_url}assets/img/flipchart/${data['fotoFlipChart']}" alt="${data['namaFlipChart']}" />
					</a>`
				);
			});
			$(".js-img-viwer").SmartPhoto();
			$('#p-flip').pxpaginate({
				align:'center',
				totalPageCount: result.count,
				nextPrevBtnShow: false,
				firstLastBtnShow: false,
				callback: function (n) {
					flip2(n-1);
				}
			});
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}
flip2 = function (page=0) {
	const xhr = new XMLHttpRequest();
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#list-flip').empty();
    }
	xhr.open("GET", `${url_api}flip.json?page=${page}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#list-flip').append(
					`<a href="${base_url}assets/img/flipchart/${data['fotoFlipChart']}" class="js-img-viwer" data-caption="${data['namaFlipChart']}" data-id="${data['idFlipChart']}">
						<img src="${base_url}assets/img/flipchart/${data['fotoFlipChart']}" alt="${data['namaFlipChart']}" />
					</a>`
				);
			});
			$(".js-img-viwer").SmartPhoto();
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}
plan = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", url_api + 'plan.json', true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 1000, animation: 'ascend' });
		}else{
			$.each(result['data'], function (d, data) {
				$('#deskripsiPlan').append(
					`<div class="card">
						${data['foto']}
						<div class="fotonya"></div>
					</div>`
				);
				$.each(data['children'], function (c, children) {
					$('.fotonya').append(
						`<div class="">
							<a href="${base_url}assets/img/flipchart/${children.foto}" class="js-img-viwer" data-caption="${children.id_marketing}" data-id="${children.id_marketing}">
								<img src="${base_url}assets/img/flipchart/${children.foto}" alt="${children.id_marketing}" class="img-responsive">
							</a>
						</div>`
					);
				});
			});
			$(".js-img-viwer").SmartPhoto();
		}
		$('ons-modal').hide();
	};
	xhr.send();
	return false;
}
produkAll = function () {
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
			$('#list-info-produk').append(`<ons-list-header>Retail</ons-list-header>`);
			$.each(result['retail'], function (d, data) {
				$('#list-info-produk').append(
					`<ons-list-item modifier="longdivider chevron" tappable onclick="produkDetail('${data.idProduk}');">
						<div class="left">
							<img class="list-item__thumbnail" src="${base_url}assets/img/produk/${data.fotoProduk}"/>
						</div>
						<div class="center">
							<span class="list-item__title">${data.namaProduk}</span>
							<span class="list-item__subtitle">Harga : ${formatRupiah(data.hargaProduk, 'Rp. ')},-</span>
						</div>
					</ons-list-item>`
				);
			});
			$('#list-info-produk').append(`<ons-list-header>Paket Reguler</ons-list-header>`);
			$.each(result['reguler'], function (d, data) {
				$('#list-info-produk').append(
					`<ons-list-item modifier="longdivider chevron" tappable onclick="produkDetail('${data.idProduk}');">
						<div class="left">
							<img class="list-item__thumbnail" src="${base_url}assets/img/produk/${data.fotoProduk}"/>
						</div>
						<div class="center">
							<span class="list-item__title">${data.namaProduk}</span>
							<span class="list-item__subtitle">Harga : ${formatRupiah(data.hargaProduk, 'Rp. ')},-</span>
						</div>
					</ons-list-item>`
				);
			});
			$('#list-info-produk').append(`<ons-list-header>Paket Fast Track</ons-list-header>`);
			$.each(result['ft'], function (d, data) {
				$('#list-info-produk').append(
					`<ons-list-item modifier="longdivider chevron" tappable onclick="produkDetail('${data.idProduk}');">
						<div class="left">
							<img class="list-item__thumbnail" src="${base_url}assets/img/produk/${data.fotoProduk}"/>
						</div>
						<div class="center">
							<span class="list-item__title">${data.namaProduk}</span>
							<span class="list-item__subtitle">Harga : ${formatRupiah(data.hargaProduk, 'Rp. ')},-</span>
						</div>
					</ons-list-item>`
				);
			});
		}
	};
	xhr.send();
	return false;
}
produkDetail = function (idProduk) {
	myPage.resetToPage('page/produk_detail.html').then(function () {
		xhr.onloadstart = function () {
	        $('#modal-produk').show();
	    }
		xhr.open("GET", url_api + 'produk_all.json?idProduk='+idProduk, true);
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
	});
}


// Transaksi //
cartAll = function () {
	cartGet();
	cartClickBayar();
	batalOnclick();
}
cartGet = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#btn-order-byr').hide();
    }
	xhr.open("GET", `${url_api}cek_cart.json?id_plm=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 500, animation: 'ascend' });
			$('#btn-ord-add').text('Next');
		}else{
			$('#btn-order-byr').show();
			$('#btn-ord-add').text('Tambah orderan');
			$.each(result.data, function (d, data) {
				$('#list-cart').append(
					`<ons-list-item modifier="longdivider" onclick="cartEdit('${data.id_cart}');">
						<table>
							<tr>
								<td>Produk</td>
								<td>:</td>
								<td>${data.namaProduk}</td>
							</tr>
							<tr>
								<td>Harga</td>
								<td>:</td>
								<td>${formatRupiah(data.hargaProduk, 'Rp. ')}</td>
							</tr>
							<tr>
								<td>Qty</td>
								<td>:</td>
								<td>${data.qty_cart}</td>
							</tr>
							<tr>
								<td>Total Harga</td>
								<td>:</td>
								<td>${formatRupiah(data.total_cart, 'Rp. ')}</td>
							</tr>
							<tr>
								<td>&nbsp;</td>
							</tr>
						</table>
					</ons-list-item>`
				);
			});
		}
	};
	xhr.send();
	return false;
}
cartEdit = function (id) {
	myPage.resetToPage('page/order_produk_edit.html', fade).then(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("GET", `${url_api}cart-get.json?id=${id}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			$('#produk-detail').html(`
				<div class="form-group">
					<label for="nama-produk">Produk</label>
					<input type="text" name="nama-produk" id="nama-produk" class="form-control" data-id="${result.data[0].idProduk}" value="${result.data[0].namaProduk}" readonly>
				</div>
			`);
			$('#produk-total').val(result.data[0].total_cart);
			for (i = 1; i <= result.data[0].stokProduk; i++) {
				$('#produk-qty').append(
					$('<option></option>').attr({"value":i}).text(i)
				);
			}
			$('#produk-qty').val(result.data[0].qty_cart)
			$('#produk-qty').change(function () {
				$('#produk-total').val(parseInt($('#produk-qty').val())*parseInt(result.data[0].hargaProduk));
			});
			cartEditExe(id);
			cartDeleteByID(id);
		};
		xhr.send();
		return false;
	});
}
cartEditExe = function (id) {
	$('#btn-cart-edit').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("POST", `${url_api}cart-edit.json`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			console.log(result);
			$('ons-modal').hide();
			if (result.status == true) {
				myPage.resetToPage('page/order.html', fade).then(function () {
					ons.notification.toast(result.message, { timeout: 1000, animation: 'ascend' });
				});
			}
		};
		xhr.send(`id=${id}&qty=${$('#produk-qty').val()}&total=${$('#produk-total').val()}`);
		return false;
	});
}
cartDeleteByID = function (id) {
	$('#btn-cart-hapus').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("POST", `${url_api}cart-delete.json`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				myPage.resetToPage('page/order.html', fade).then(function () {
					ons.notification.toast(result.message, { timeout: 1000, animation: 'ascend' });
				});
			}
		};
		xhr.send(`id=${id}`);
		return false;
	});
}
cartClickBayar = function () {
	$('#bayarkeun-pindah').click(function () {
		myPage.resetToPage('page/order_bayar.html', {animation:'fade'});
	});
}
batalOnclick = function () {
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
orderProduk = function () {
	orderProdukKategori();
	orderProdukID();
	orderProdukClick();
}
orderProdukKategori = function () {
	$('#select-order-kategory').change(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#select-order').html('<option value="">Pilih produk</option>');
	        $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        $('#produk-total').val(0);
	        $('#tb-produk-detail').empty();
	        $('#tb-produk-detail-parent').empty();
	    }
		xhr.open("GET", `${url_api}change-kategori.json?id_kategori=${$('#select-order-kategory').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 800, animation: 'ascend' });
			}else{
				$.each(result.data, function (d, data) {
					$('#select-order').append(
						$('<option></option>').attr({"value":data['idProduk']}).text(data['namaProduk'])
					);
				});
			}
		};
		xhr.send();
		return false;
	});
}
orderProdukID = function () {
	$('#select-order').click(function () {
		if ($('#select-order-kategory').val()=="") {
			ons.notification.toast('Silahkan pilih kategori terlebih dahulu!', { timeout: 800, animation: 'ascend' });
		}
	});
	$('#select-order').change(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
			$('#produk-total').val(0);
			$('#tb-produk-detail-parent').empty();
	    }
		xhr.open("GET", `${url_api}change-produk.json?produk=${$('#select-order').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 800, animation: 'ascend' });
			}else{
				if (result.parent.length == 0) {
					$.each(result.produk, function (d, data) {
						$('#tb-produk-detail').html(
							`<table width="100%">
								<tr>
									<td>Nama</td>
									<td>:</td>
									<td>${data.namaProduk}</td>
								<tr>
								<tr>
									<td>Harga</td>
									<td>:</td>
									<td>${formatRupiah(data.hargaProduk, 'Rp. ')}</td>
								<tr>
								<tr>
									<td>Stok</td>
									<td>:</td>
									<td>${data.stokProduk}</td>
								<tr>
							</table>`
						);
					});
				}else{
					$.each(result.produk, function (d, data) {
						$('#tb-produk-detail').html(
							`<table width="100%">
								<tr>
									<td>Nama Paket</td>
									<td>:</td>
									<td>${data.namaProduk}</td>
								</tr>
								<tr>
									<td>Harga</td>
									<td>:</td>
									<td>${formatRupiah(data.hargaProduk, 'Rp. ')}</td>
								</tr>
								<tr>
									<td>Produk dalam paket</td>
									<td>:</td>
								</tr>
							</table>`
						);
						$.each(result.parent, function (d, data) {
							$('#tb-produk-detail-parent').append(
								`<table width="100%">
									<tr>
										<td>${data.stokProduk} ${data.namaProduk}</td>
									</tr>
								</table>`
							);
						});
					});
				}
				for (i = 1; i <= result['produk'][0]['stokProduk']; i++) {
					$('#produk-qty').append(
						$('<option></option>').attr({"value":i}).text(i)
					);
				}
				$('#produk-qty').change(function () {
					$('#produk-total').val(parseInt($('#produk-qty').val())*parseInt(result['produk'][0]['hargaProduk']));
				});
			}
		};
		xhr.send();
		return false;
	});
}
orderProdukClick = function () {
	$('.btn-produk-bayar').click(function () {
		const btn = $(this).data('id');
		if ($('#select-order-kategory').val() !== "" && $('#select-order').val() !== "" && $('#produk-qty').val() !== "" && $('#produk-total').val() !== 0) {
			const data = 
				`id_plm=${getStorage('id_plm')}&kategori=${$('#select-order-kategory').val()}&idProduk=${$('#select-order').val()}&qty_cart=${$('#produk-qty').val()}&total_cart=${$('#produk-total').val()}`;
				
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
						ons.notification.toast(result['message'], { timeout: 1200, animation: 'ascend' }).then(function () {
							// $('#select-order-kategory').html('<option value="">Pilih kategori</option>');
							// $('#select-order').html('<option value="">Pilih produk</option>');
							// $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
							// $('#tb-produk-detail').empty();
							// $('#tb-produk-detail-parent').empty();
							// $('#produk-total').val(0);
							$('#page-order-produk-hide').addClass('visible');
							// orderProdukKategori();
						});
					}
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
pageBayarAll = function () {
	$('#detail-bayar').hide();
	getProvinsi();
	getKota();
	getKecamatan();
	getOngkir();
	onclickKecamatan();
	onclickOngkir();
	getJumlahOngkir();
	getConsumerByID();
	postOrder();
}
getConsumer = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", `${url_api}get-consumer.json?id_plm=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#pilih-consumer').append(
					$('<option></option>').attr({"value":data['id_consumer']}).text(data['nama_penerima'])
				);
			});
		}
	};
	xhr.send();
	return false;
}
getConsumerByID = function () {
	$('#pilih-consumer').change(function () {
		if ($('#pilih-consumer').val() != 0) {
			xhr.onloadstart = function () {
		        $('ons-modal').show();
		    }
			xhr.open("GET", `${url_api}get-consumer.json?consumer=${$('#pilih-consumer').val()}`, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				const result = JSON.parse(this.responseText);
				$('ons-modal').hide();
				if (result.status == true) {
					$('#ongkir-nama-ke').val(result.data.nama_penerima);
					$('#ongkir-nowa-ke').val(result.data.nowa_penerima);
					$('#ongkir-pos-ke').val(result.data.codepos_consumer);
					$('#ongkir-alamat-ke').text(result.data.alamat_penerima);
					$('#ongkir-provinsi-ke').val(result.data.provinsi_consumer);
					getKotaByConsumer(result.data.kota_consumer, result.data.kecamatan_consumer);
				}else{
					ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
				}
			};
			xhr.send();
			return false;
		}else{
			$('#ongkir-nama-ke').val('');
			$('#ongkir-nowa-ke').val('');
			$('#ongkir-pos-ke').val('');
			$('#ongkir-alamat-ke').text('');
			$('#ongkir-provinsi-ke').val('');
			$('#ongkir-kota-ke').val('');
			$('#ongkir-kecamatan-ke').val('');
			$('#ongkir-ekspedisi').val('');
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        $('#detail-bayar').hide();
		}
	});

	function getKotaByConsumer(id, id_kec) {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#ongkir-kota-ke').html('<option value="">Pilih kota atau kabupaten</option>');
	        $('#ongkir-kecamatan-ke').html('<option value="">Pilih kecamatan</option>');
	        $('#ongkir-ekspedisi').val("");
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        // $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        // $('#produk-total').val(0);
	        // $('#tb-produk-detail').empty();
	        // $('#tb-produk-detail-parent').empty();
    	}
		xhr.open("GET", `${url_api}get-kota.json?provinsi=${$('#ongkir-provinsi-ke').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {	
					$('#ongkir-kota-ke').append(
						$('<option></option>').attr({"value":data['id_kota']}).text(data['kota'])
					);
				});
				$('#ongkir-kota-ke').val(id);
				setTimeout(getKecamatanByConsumer(id_kec), 5000);
			}else{
				ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	}

	function getKecamatanByConsumer(id) {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#ongkir-kecamatan-ke').html('<option value="">Pilih kecamatan</option>');
	        $('#ongkir-ekspedisi').val("");
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        // $('#ongkir-kota-dari').html('<option value="">Pilih kota atau kabupaten</option>');
	        // $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        // $('#produk-total').val(0);
	        // $('#tb-produk-detail').empty();
	        // $('#tb-produk-detail-parent').empty();
    	}
		xhr.open("GET", `https://ruangmember.kadetech.tech/api/get-kecamatan.json?kota=${$('#ongkir-kota-ke').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.rajaongkir.status.code == 200) {
				$.each(result.rajaongkir.results, function (d, data) {	
					$('#ongkir-kecamatan-ke').append(
						$('<option></option>').attr({"value":data['subdistrict_id']}).text(data['subdistrict_name'])
					);
				});
				$('#ongkir-kecamatan-ke').val(id);
			}else{
				ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	}
}
getProvinsi = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", `${url_api}get-provinsi.json`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#ongkir-provinsi-ke').append(
					$('<option></option>').attr({"value":data['id_provinsi']}).text(data['provinsi'])
				);
			});
			getConsumer();
		}else{
			ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
getKota = function () {
	$('#ongkir-provinsi-ke').change(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#ongkir-kota-ke').html('<option value="">Pilih kota atau kabupaten</option>');
	        $('#ongkir-kecamatan-ke').html('<option value="">Pilih kecamatan</option>');
	        $('#ongkir-ekspedisi').val("");
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        // $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        // $('#produk-total').val(0);
	        // $('#tb-produk-detail').empty();
	        // $('#tb-produk-detail-parent').empty();
    	}
		xhr.open("GET", `${url_api}get-kota.json?provinsi=${$('#ongkir-provinsi-ke').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {	
					$('#ongkir-kota-ke').append(
						$('<option></option>').attr({"value":data['id_kota']}).text(data['kota'])
					);
				});
			}else{
				ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
getKecamatan = function () {
	$('#ongkir-kota-ke').change(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#ongkir-kecamatan-ke').html('<option value="">Pilih kecamatan</option>');
	        $('#ongkir-ekspedisi').val("");
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        // $('#ongkir-kota-dari').html('<option value="">Pilih kota atau kabupaten</option>');
	        // $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        // $('#produk-total').val(0);
	        // $('#tb-produk-detail').empty();
	        // $('#tb-produk-detail-parent').empty();
    	}
		xhr.open("GET", `https://ruangmember.kadetech.tech/api/get-kecamatan.json?kota=${$('#ongkir-kota-ke').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.rajaongkir.status.code === 200) {
				$.each(result.rajaongkir.results, function (d, data) {	
					$('#ongkir-kecamatan-ke').append(
						$('<option></option>').attr({"value":data['subdistrict_id']}).text(data['subdistrict_name'])
					);
				});
			}else{
				ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
onclickKecamatan = function () {
	$('#ongkir-kecamatan-ke').change(function () {
		$('#ongkir-ekspedisi').val("");
        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	});
}
onclickOngkir = function () {
	$('#ongkir-tipe-ekspedisi').click(function () {
		if ($('#ongkir-provinsi-ke').val() == "") {
			ons.notification.toast('Silahkan pilih terlebih dahulu provinsi', { timeout: 1000, animation: 'ascend' });
		}else if ($('#ongkir-kota-ke').val() == "") {
			ons.notification.toast('Silahkan pilih terlebih dahulu kota atau kabupaten', { timeout: 1000, animation: 'ascend' });
		}else if ($('#ongkir-kecamatan-ke').val() == "") {
			ons.notification.toast('Silahkan pilih terlebih dahulu kecamatan', { timeout: 1000, animation: 'ascend' });
		}else if ($('#ongkir-berat').val() == "") {
			ons.notification.toast('Silahkan pilih terlebih dahulu berat', { timeout: 1000, animation: 'ascend' });
		}else if ($('#ongkir-ekspedisi').val() == "") {
			ons.notification.toast('Silahkan pilih terlebih dahulu courir', { timeout: 1000, animation: 'ascend' });
		}
	});
}
getOngkir = function () {
	$('#ongkir-ekspedisi').change(function () {
		const data = `ongkir-ke=${$('#ongkir-kecamatan-ke').val()}&ongkir-berat=${$('#ongkir-berat').val()}&ongkir-ekspedisi=${$('#ongkir-ekspedisi').val()}`;
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#ongkir-tipe-ekspedisi').html('<option value="">Tipe pengiriman</option>');
	        // $('#produk-qty').html('<option value="">Pilih jumlah Qty</option>');
	        // $('#produk-total').val(0);
	        // $('#tb-produk-detail').empty();
	        // $('#tb-produk-detail-parent').empty();
    	}
		xhr.open("POST", `https://ruangmember.kadetech.tech/api/get-ongkir.json`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.rajaongkir.status.code === 200) {
				if (result.rajaongkir.results[0].costs.length > 0) {
					$.each(result.rajaongkir.results[0].costs, function (d, data) {
						$('#ongkir-tipe-ekspedisi').append(
							$('<option></option>').attr({"value":data['service'], "data-id":data.cost[0].value}).text(`${data['service']} (${data.description}) / ${data.cost[0].etd} hari / Rp. ${data.cost[0].value}`)
						);
					});
				}else{
					ons.notification.toast('Courir tidak tersedia, silahkan pilih yang lain', { timeout: 1000, animation: 'ascend' });
				}
			}else{
				ons.notification.toast('API error silahkan hubungi pengembang aplikasi', { timeout: 1000, animation: 'ascend' });
			}
		};
		xhr.send(data);
		return false;
	});
}
getJumlahOngkir = function () {
	$('#ongkir-tipe-ekspedisi').change(function () {
		$('#jml-ongkir').text($(this).find(':selected').data("id"));
		// getJumlah();
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("GET", `${url_api}cek_cart.json?id_plm=${getStorage('id_plm')}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==false) {
				ons.notification.toast(result['message'], { timeout: 500, animation: 'ascend' });
			}else{
				$('#jml-order').text(result.total.total_bayar);
				$('#jml-bayar').text(parseInt($('#jml-ongkir').text()) + parseInt($('#jml-order').text()));
				$('#detail-bayar').show();
			}
		};
		xhr.send();
		return false;
	});
}
getJumlah = function () {
	xhr.open("GET", `${url_api}cek_cart.json?id_plm=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result['status']==false) {
			ons.notification.toast(result['message'], { timeout: 500, animation: 'ascend' });
		}else{
			$('#jml-order').text(result.total.total_bayar);
			$('#jml-bayar').text(parseInt($('#jml-ongkir').text()) + parseInt($('#jml-order').text()));
			$('#detail-bayar').show();
		}
	};
	xhr.send();
	// return false;
}
postOrder = function () {
	$('#bayarkeun').click(function () {
		const 	consumer = $('#pilih-consumer').val(),
				nama = $('#ongkir-nama-ke').val(),
				nowa = $('#ongkir-nowa-ke').val(),
				provinsi = $('#ongkir-provinsi-ke').val(),
				kota = $('#ongkir-kota-ke').val(),
				kecamatan = $('#ongkir-kecamatan-ke').val(),
				pos = $('#ongkir-pos-ke').val(),
				alamat = $('#ongkir-alamat-ke').val(),
				berat = $('#ongkir-berat').val(),
				ekspedisi = $('#ongkir-ekspedisi').val(),
				ekspedisi_tipe = $('#ongkir-tipe-ekspedisi').val(),
				ongkir = $('#ongkir-tipe-ekspedisi').find(':selected').data("id"),
				total_bayar = parseInt($('#jml-order').text()),
				id_plm = getStorage('id_plm');
		if (consumer != "" && nama != "" && nowa != "" && provinsi != "" && kota != "" && kecamatan != "" && pos != "" && alamat != "" && berat != "" && ekspedisi != "" && ekspedisi_tipe != "") {
			const data = `consumer=${consumer}&nama=${nama}&nowa=${nowa}&provinsi=${provinsi}&kota=${kota}&kecamatan=${kecamatan}&pos=${pos}&alamat=${alamat}&ekspedisi=${ekspedisi}&ekspedisi_tipe=${ekspedisi_tipe}&ongkir=${ongkir}&total_bayar=${total_bayar}&id_plm=${id_plm}&alamat_lengkap=${alamat}. KEC. ${$('#ongkir-kecamatan-ke').find(':selected').text()}, KAB / KOTA. ${$('#ongkir-kota-ke').find(':selected').text()}, PROV. ${$('#ongkir-provinsi-ke').find(':selected').text()}`;
			xhr.onloadstart = function () {
		        $('ons-modal').show();
	    	}
			xhr.open("POST", `${url_api}orderkeun.json`, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				const result = JSON.parse(this.responseText);
				$('ons-modal').hide();
				if (result.status == true) {
					myPage.resetToPage('page/report_bs.html', fade).then(function () {
						ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
					});
				}else{
					ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
				}
			};
			xhr.send(data);
			return false;
		}else{
			ons.notification.toast('Silahkan lengkapi data Transaksi Anda...', { timeout: 2000, animation: 'ascend' });
		}
	});
}

// Report //
initRBS = function () {
	$('[data-toggle="datepicker"]').datepicker({
		format: 'yyyy-mm-dd',
		autoHide: true,
	});
	var pullHook = document.getElementById('pull-hook');

	pullHook.addEventListener('changestate', function(event) {
		var message = '';

		switch (event.state) {
			case 'initial':
				message = 'Tarik untuk merefresh tabel';
				break;
			case 'preaction':
				message = 'Release';
				break;
			case 'action':
				message = 'Loading...';
				break;
	}

		pullHook.innerHTML = message;
	});

	pullHook.onAction = function(done) {
		getRBS();
		done();
	};
}
getRBS = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rbs').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=menunggu&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rbs').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td><button class="btn btn-full" onclick="moveToSendBukti('${data.id_order}')">Upload</button></td>
					</tr>
				`);
			});
			$('#p-rbs').pxpaginate({
				align:'center',
				totalPageCount: result.count,
				nextPrevBtnShow: false,
				firstLastBtnShow: false,
				callback: function (n) {
					getRBS2(n-1);
				}
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
getRBS2 = function (page) {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rbs').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?page=${page}&status=menunggu&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rbs').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td><button class="btn btn-full" onclick="moveToSendBukti('${data.id_order}')">Upload</button></td>
					</tr>
				`);
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
searchBS = function () {
	$('#btn-rbs-search').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#tb-rbs').empty();
	        $('#p-rbs').empty();
		}
		xhr.open("GET", `${url_api}search-report.json?text=${$('#rbs-text').val()}&date=${$('#rbs-date').val()}&status=menunggu&id=${getStorage('id_plm')}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {
					$('#tb-rbs').append(`
						<tr>
							<td>${data.id_order}</td>
							<td>${data.nama_penerima}</td>
							<td><button class="btn btn-full" onclick="moveToSendBukti('${data.id_order}')">Upload</button></td>
						</tr>
					`);
				});
			}else{
				ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
moveToSendBukti = function (id) {
	myPage.resetToPage('page/order_confirm_upload.html', {animation:'slide'}).then(function () {
		$('#upload-id-order').val(id);

		xhr.onloadstart = function () {
	        $('ons-modal').show();
	    }
		xhr.open("GET", `${url_api}in-form-upload.json?id=${id}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			$('#upload-total').val(result.data[0].total_order);
			$('#upload-ongkir').val(result.data[0].order_ongkir);
			$('#upload-jb').val(parseInt(result.data[0].total_order) + parseInt(result.data[0].order_ongkir));
			getBankAdmin();
		}
		xhr.send();
		return false;
	});
}
getBankAdmin = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
    }
	xhr.open("GET", `${url_api}bank_admin.json`, true);
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
			getBankAdminByID();
		}
	}
	xhr.send();
	return false;
}
getBankAdminByID = function () {
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
				$('#if-cod').show();
				$('#if-bank').hide();
			}else{
				$('#if-cod').hide();
				$('#if-bank').show();
			}
			postSendBukti();
		}
		xhr.send();
		return false;
	});
}
postSendBukti = function () {
	$('#file').change(function () {
		console.log($('#file')[0].files[0].name);
		$('#name-img').text($('#file')[0].files[0].name);
	});
	$('#upByGalery').click(function () {
		const formData = new FormData();
		formData.append('id', $('#upload-id-order').val());
		formData.append('bank', $('#upload-id-bank').val());
		formData.append('file', $('#file')[0].files[0]);
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("POST", url_api + 'finish.json', true);
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==true) {
				ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' }).then(function () {
					page_bukti($('#upload-id-bank').val(), result.foto);
				});
			}else{
				ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' });
			}
		};
		xhr.send(formData);
		return false;
	});
	$('#upByCOD').click(function () {
		xhr.onloadstart = function () {
            $('ons-modal').show();
        }
		xhr.open("GET", `${url_api}finish.json?id=${$('#upload-id-order').val()}&bank=${$('#upload-id-bank').val()}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result['status']==true) {
				ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' }).then(function () {
					page_bukti($('#upload-id-bank').val(), result.foto);
				});
			}else{
				ons.notification.toast(result['message'], { timeout: 3000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
function page_bukti(idBank, foto) {
	myPage.resetToPage('page/order_confirm_bukti.html', {animation:'fade'}).then(function () {
		if (idBank == 4) {
			$('#img-bukti-transfer').attr('src', base_url+'assets/img/bukti/cod.jpg');
		}else{
			$('#img-bukti-transfer').attr('src', base_url+'assets/img/bukti/'+foto);
		}
		$('#screenshoot-bukti').click(function () {
			navigator.screenshot.save(function(error,res){
				if(error){
					console.log(error);
					myPage.resetToPage('page/beranda.html', {animation:'fade'}).then(function () {
						ons.notification.toast('Screenshot error perangkat anda tidak mendukung ', { timeout: 2000, animation: 'ascend' });
					});
				}else{
					myPage.resetToPage('page/beranda.html', {animation:'fade'}).then(function () {
						ons.notification.toast('Screenshot berhasil disimpan di Galeri', { timeout: 2000, animation: 'ascend' });
					});
				}
			});
		});
	});
}

initRDP = function () {
	swiftRefreshDP();
	getRDP();
	searchDP();
}
swiftRefreshDP = function () {
	$('[data-toggle="datepicker"]').datepicker({
		format: 'yyyy-mm-dd',
		autoHide: true,
	});
	var pullHook = document.getElementById('pull-hook');

	pullHook.addEventListener('changestate', function(event) {
		var message = '';

		switch (event.state) {
			case 'initial':
				message = 'Tarik untuk merefresh tabel';
				break;
			case 'preaction':
				message = 'Release';
				break;
			case 'action':
				message = 'Loading...';
				break;
	}

		pullHook.innerHTML = message;
	});

	pullHook.onAction = function(done) {
		getRDP();
		done();
	};
}
getRDP = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rdp').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=diproses&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rdp').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td>${data.order_status}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
			$('#p-rdp').pxpaginate({
				align:'center',
				totalPageCount: result.count,
				nextPrevBtnShow: false,
				firstLastBtnShow: false,
				callback: function (n) {
					getRDP2(n-1);
				}
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
getRDP2 = function (page) {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rdp').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=diproses&page=${page}&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rdp').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td>${data.order_status}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
searchDP = function () {
	$('#btn-rdp-search').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#tb-rdp').empty();
	        $('#p-rdp').empty();
		}
		xhr.open("GET", `${url_api}search-report.json?text=${$('#rdp-text').val()}&date=${$('#rdp-date').val()}&status=diproses&id=${getStorage('id_plm')}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {
					$('#tb-rdp').append(`
						<tr>
							<td>${data.id_order}</td>
							<td>${data.nama_penerima}</td>
							<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
							<td>${data.order_status}</td>
							<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
						</tr>
					`);
				});
			}else{
				ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
initRDK = function () {
	swiftRefreshDK();
	getRDK();
	searchDK();
}
swiftRefreshDK = function () {
	$('[data-toggle="datepicker"]').datepicker({
		format: 'yyyy-mm-dd',
		autoHide: true,
	});
	var pullHook = document.getElementById('pull-hook');

	pullHook.addEventListener('changestate', function(event) {
		var message = '';

		switch (event.state) {
			case 'initial':
				message = 'Tarik untuk merefresh tabel';
				break;
			case 'preaction':
				message = 'Release';
				break;
			case 'action':
				message = 'Loading...';
				break;
	}

		pullHook.innerHTML = message;
	});

	pullHook.onAction = function(done) {
		getRDK();
		done();
	};
}
getRDK = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rdk').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=dikirim&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rdk').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${data.resi}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
			$('#p-rdk').pxpaginate({
				align:'center',
				totalPageCount: result.count,
				nextPrevBtnShow: false,
				firstLastBtnShow: false,
				callback: function (n) {
					getRDK2(n-1);
				}
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
getRDK2 = function (page) {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rdk').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=dikirim&page=${page}&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rdk').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${data.resi}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
searchDK = function () {
	$('#btn-rdk-search').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#tb-rdk').empty();
	        $('#p-rdk').empty();
		}
		xhr.open("GET", `${url_api}search-report.json?text=${$('#rdk-text').val()}&date=${$('#rdk-date').val()}&status=dikirim&id=${getStorage('id_plm')}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {
					$('#tb-rdk').append(`
						<tr>
							<td>${data.id_order}</td>
							<td>${data.nama_penerima}</td>
							<td>${data.resi}</td>
							<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
							<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
						</tr>
					`);
				});
			}else{
				ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
initRS = function () {
	swiftRefreshS();
	getRS();
	searchS();
}
swiftRefreshS = function () {
	$('[data-toggle="datepicker"]').datepicker({
		format: 'yyyy-mm-dd',
		autoHide: true,
	});
	var pullHook = document.getElementById('pull-hook');

	pullHook.addEventListener('changestate', function(event) {
		var message = '';

		switch (event.state) {
			case 'initial':
				message = 'Tarik untuk merefresh tabel';
				break;
			case 'preaction':
				message = 'Release';
				break;
			case 'action':
				message = 'Loading...';
				break;
	}

		pullHook.innerHTML = message;
	});

	pullHook.onAction = function(done) {
		getRS();
		done();
	};
}
getRS = function () {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rselesai').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=selesai&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rselesai').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${data.resi}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
			$('#p-rselesai').pxpaginate({
				align:'center',
				totalPageCount: result.count,
				nextPrevBtnShow: false,
				firstLastBtnShow: false,
				callback: function (n) {
					getRS2(n-1);
				}
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
getRS2 = function (page) {
	xhr.onloadstart = function () {
        $('ons-modal').show();
        $('#tb-rselesai').empty();
	}
	xhr.open("GET", `${url_api}get-report.json?status=selesai&page=${page}&id=${getStorage('id_plm')}`, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.onload = function () {
		const result = JSON.parse(this.responseText);
		$('ons-modal').hide();
		if (result.status == true) {
			$.each(result.data, function (d, data) {
				$('#tb-rselesai').append(`
					<tr>
						<td>${data.id_order}</td>
						<td>${data.nama_penerima}</td>
						<td>${data.resi}</td>
						<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
						<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
					</tr>
				`);
			});
		}else{
			ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
		}
	};
	xhr.send();
	return false;
}
searchS = function () {
	$('#btn-rselesai-search').click(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#tb-rselesai').empty();
	        $('#p-rselesai').empty();
		}
		xhr.open("GET", `${url_api}search-report.json?text=${$('#rselesai-text').val()}&date=${$('#rselesai-date').val()}&status=dikirim&id=${getStorage('id_plm')}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				$.each(result.data, function (d, data) {
					$('#tb-rselesai').append(`
						<tr>
							<td>${data.id_order}</td>
							<td>${data.nama_penerima}</td>
							<td>${data.resi}</td>
							<td>${moment(data.tgl_order, "YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</td>
							<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
						</tr>
					`);
				});
			}else{
				ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}
moveToDetailOrder = function (id) {
	myPage.resetToPage('page/report_detail.html', {animation:'slide'}).then(function () {
		xhr.onloadstart = function () {
	        $('ons-modal').show();
	        $('#tb-rdetail').empty();
		}
		xhr.open("GET", `${url_api}detail-report.json?order=${id}`, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.onload = function () {
			const result = JSON.parse(this.responseText);
			$('ons-modal').hide();
			if (result.status == true) {
				console.log(result);
				$('#tb-rdetail1').append(`
					<tr>
						<td>ID Order</td>
						<td>:</td>
						<td>${result.data[0].id_order}</td>
					</tr>
					<tr>
						<td>Pelanggan</td>
						<td>:</td>
						<td>${result.data[0].nama_penerima}</td>
					</tr>
					<tr>
						<td>Status</td>
						<td>:</td>
						<td>${result.data[0].order_status}</td>
					</tr>
				`);
				$.each(result.data, function (d, data) {
					$('#tb-rdetail').append(`
						<tr>
							<td>${data.namaProduk}</td>
							<td>${data.hargaProduk}</td>
							<td>${data.qty_detail}</td>
							<td>${data.total_detail}</td>
						</tr>
					`);
				});
				$('#tb-rdetail2').append(`
					<tr>
						<td colspan="3" align="right">Total</td>
						<td>${result.data[0].total_order}</td>
					</tr>
					<tr>
						<td colspan="3" align="right">Ongkir</td>
						<td>${result.data[0].order_ongkir}</td>
					</tr>
					<tr>
						<td colspan="3" align="right">Jumlah Bayar</td>
						<td>${parseInt(result.data[0].total_order) + parseInt(result.data[0].order_ongkir)}</td>
					</tr>
				`);
			}else{
				ons.notification.toast(result.message, { timeout: 2000, animation: 'ascend' });
			}
		};
		xhr.send();
		return false;
	});
}

initKomisi = function () {
	getKomisi();
	cariKomisi();
}
getKomisi = function () {
	const sekarang = new Date().getFullYear();
	for (var i = sekarang; i>=2020; i--) {
		$('#tahun').append(
			$('<option></option>').attr({"value":i}).text(i)
		);
	}
}
cariKomisi = function () {
	$('#btn-komisi').click(function () {
		if ($('#bulan').val() != '' && $('#tahun').val() != '' && $('#status').val() != '') {
			xhr.onloadstart = function () {
		        $('ons-modal').show();
		        $('#tb-komisi').empty();
			}
			xhr.open("GET", `${url_api}bonusku.json?id=${getStorage('id_plm')}&bulan=${$('#bulan').val()}&tahun=${$('#tahun').val()}&status=${$('#status').val()}`, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.onload = function () {
				const result = JSON.parse(this.responseText);
				$('ons-modal').hide();
				if (result.status == true) {
					if ($('#status').val() != '3') {
						$('#tb-komisi').html(`
							<thead>
								<tr>
									<th>ID Order</th>
									<th>Tanggal</th>
									<th>Jumlah</th>
									<th>#</th>
								</tr>
							</thead>
							<tbody id="tb-komisi-body"></tbody>
							<tbody id="tb-komisi-body-2">
								<tr>
									<th colspan="2">Total (admin 10%)</th>
									<th>${result.total.total_bonus}</th>
									<th>#</th>
								</tr>
							</tbody>
						`);
						$.each(result.data, function (d, data) {
							if (data.status_bonus == 0) {
								var status = 'belum';
							}else{
								var status = 'sudah';
							}
							$('#tb-komisi-body').append(
								`<tr>
									<td>${data.id_order}</td>
									<td>${data.tgl_bonus}</td>
									<td>${data.komisi}</td>
									<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
								</tr>`
							);
						});
					}else{
						$('#tb-komisi').html(`
							<thead>
								<tr>
									<th>ID Order</th>
									<th>Tanggal</th>
									<th>Diterima</th>
									<th>Jumlah</th>
									<th>#</th>
								</tr>
							</thead>
							<tbody id="tb-komisi-body-all"></tbody>
						`);
						$.each(result.data, function (d, data) {
							if (data.status_bonus == 0) {
								var status = 'belum';
							}else{
								var status = 'sudah';
							}
							$('#tb-komisi-body-all').append(
								`<tr>
									<td>${data.id_order}</td>
									<td>${data.tgl_bonus}</td>
									<td>${status}</td>
									<td>${data.komisi}</td>
									<td><button class="btn btn-white" onclick="moveToDetailOrder('${data.id_order}')"><i class="fa fa-info"></i></button></td>
								</tr>`
							);
						});
					}
				}else{
					ons.notification.toast('Data tidak di temukan', { timeout: 2000, animation: 'ascend' });
				}
			}
			xhr.send();
			return false;
		}else{
			ons.notification.toast('Lengkapi bulan dan tahun!', { timeout: 2000, animation: 'ascend' });
		}
	});
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
function askBonus() {
	ons.notification.confirm('Menanyakan komisi ke Admin?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
		if (index==0) {
			window.plugins.socialsharing.shareViaWhatsAppToPhone('+6282113122700', 'Hallo Admin, saya ingin menanyakan komisi saya', null /* img */, null /* url */, function() {console.log('share ok')})
		}
	});
}


// TOOLS //
moveOnMax = function (field, nextFieldID) {
	if ($(field).val().length == 1) {
		document.getElementById(nextFieldID).focus();
	}
}
moveOnDelete = function () {
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
formatRupiah = function (angka, prefix){
	if (angka != null) {
		var number_string = angka.replace(/[^,\d]/g, '').toString(),
		split = number_string.split(','),
		sisa = split[0].length % 3,
		rupiah = split[0].substr(0, sisa),
		ribuan = split[0].substr(sisa).match(/\d{3}/gi);
		if(ribuan){
			separator = sisa ? '.' : '';
			rupiah += separator + ribuan.join('.');
		}
		rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
		return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
	}
}
setStorage = function (key, val) {
	return storage.setItem(key, val);
}
getStorage = function (key) {
	return storage.getItem(key);
}
removeStorage = function (key) {
	return storage.removeItem(key);
}
openVideo = function (id) {
	window.InAppYouTube.openVideo(id, {
		fullscreen: true
	});
}
backButton = function (page) {
	ons.setDefaultDeviceBackButtonListener(function() {
		myPage.resetToPage('page/'+page, {animation:'slide'});
	});
}
exitApp = function () {
	ons.setDefaultDeviceBackButtonListener(function() {
		ons.notification.confirm('Apakah Anda yakin ingin keluar Aplikasi?', {buttonLabels:["Ya", "Tidak"]}).then(function (index) {
			if (index==0) {
				navigator.app.exitApp();
			}
		});	
	});
}

// function base64ToBlob(base64, mime) {
//     mime = mime || '';
//     var sliceSize = 1024;
//     var byteChars = window.atob(base64);
//     var byteArrays = [];

//     for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
//         var slice = byteChars.slice(offset, offset + sliceSize);

//         var byteNumbers = new Array(slice.length);
//         for (var i = 0; i < slice.length; i++) {
//             byteNumbers[i] = slice.charCodeAt(i);
//         }

//         var byteArray = new Uint8Array(byteNumbers);

//         byteArrays.push(byteArray);
//     }

//     return new Blob(byteArrays, {type: mime});
// }
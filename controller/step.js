$(document).ready(function () {
  const url = $('#myurl').data('url');
  const url_api = $('#myurl').data('url') + 'api/';
  const storage = window.localStorage;
  // const players = new Plyr('#player');
  // window.players = players;
  const modal2 = document.querySelector(".modal2");
  function toggleModal() {
        modal2.classList.toggle("show-modal2");
    }
    function windowOnClick(event) {
        if (event.target === modal2) {
            toggleModal();
            $("#player")[0].pause();
        }
    }
    $('.close-button-modal2').click(function () {
    toggleModal();
    $("#player")[0].pause();
  });
    window.addEventListener("click", windowOnClick);

  $(document).on('click', '.pilih-template', function () {
    $('#template').val($(this).data('id'));
    setStorage('template', $('#template').val());
    setStorage('url_template', $(this).data('url'));
    setStorage('thumb_template', $(this).data('url')+'Thumb/'+$(this).data('thumb'));
    setStorage('temp_tumb', $(this).data('url')+'Closing/'+$(this).data('thumb'));
    $('#check-template').removeClass('hilang');
    myPage.resetToPage('page/video-review.html', {animation:'slide'});
    // toggleModal();
    // $('#player source').attr('src', getStorage('url_template')+getStorage('template'));
    // $("#player")[0].load();
    // $("#player")[0].play();
  });
  $('#step-pagination').pagination({
        cssStyle: 'compact-theme',
        itemsOnPage: 6,
        onPageClick (pageNumber, event){
          getTemplate($('#select-template').val(), pageNumber-1);
        }
    });
  $('#btn-next-template').click(function () {
    if ($('#template').val() != "") {
      if (getStorage('id-template') != 5) {
        myPage.resetToPage('page/step-3.html', {animation:'slide'}).then(function () {
          // console.log(getStorage('id-template'));
          if (getStorage('id-template') == 4) {
            $('#bg-product-closing').show();
            $('#bg-template-closing').hide();
            $('#img-product-closing').attr('src', getStorage('temp_tumb'));
          }else if(getStorage('id-template') == 11){
            $('#bg-product-closing').show();
            $('#bg-template-closing').hide();
            $('#img-product-closing').attr('src', getStorage('temp_tumb'));
          }else{
            $('#bg-product-closing').hide();
            $('#bg-template-closing').show();
          }
        })
      }else{
        myPage.resetToPage('page/step-2.html', {animation:'slide'}).then(function () {
          $.getJSON("./template.json", function (data) {
            $('#masking-text-1').text(data[getStorage('template')]["masking-text-1"]["label"]);
            $('#text-1').val(data[getStorage('template')]["masking-text-1"]["value"]);
            setStorage('text-1', data[getStorage('template')]["masking-text-1"]["value"]);
            $('#masking-text-2').text(data[getStorage('template')]["masking-text-2"]["label"]);
            setStorage('text-2', data[getStorage('template')]["masking-text-2"]["value"]);
            $('#text-2').val(data[getStorage('template')]["masking-text-2"]["value"]);
            if (data[getStorage('template')]["masking-text-3"] != null) {  
              $('#masking-text-3').text(data[getStorage('template')]["masking-text-3"]["label"]);
              $('#text-3').val(data[getStorage('template')]["masking-text-3"]["value"]);
              setStorage('text-3', data[getStorage('template')]["masking-text-3"]["value"]);
            }
          });
        });
      }
    }else{
      getNotif('Silahkan pilih Template terlebih dahulu');
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
  if (getStorage('thumb_template') != null) {
    $('#template').val(getStorage('template'));
    $('#check-template').removeClass('hilang');
    $('#img-template').attr('src', getStorage('thumb_template'))
  }

  // Step 1
  if (getStorage('id-template') != "" && getStorage('id-template') != null) {
    $('#select-template').val(getStorage('id-template'));
    getTemplate(getStorage('id-template'), 0);
  }
  $('#select-template').change(function () {
    if ($('#select-template').val() != "") {
      setStorage('id-template', $('#select-template').val());
      getTemplate($('#select-template').val(), 0);
    }
  });

  function getTemplate(kategori, page) {
    if (kategori != "" && kategori != null) {
      const xhr = new XMLHttpRequest();
      xhr.onloadstart = function () {
          $('#modal-load-video').show();
      }
      xhr.open("GET", `${url_api}get-template.json?kategori=${kategori}&page=${page}&distribution=${getStorage('mydistribution')}`, true);
      xhr.onload = function () {
        const result = JSON.parse(this.responseText);
        $('#modal-load-video').hide();
        if (result.status == true) {
          $('#row-template').empty();
          $('#step-pagination').pagination('updateItems', result.jml_data);
          $.each(result.data, function (i, data) {
            const nama = data.nama_video.substr(0, 23);
            const name = (nama.length == 23 ? nama+'...' : nama);
            var th;
            if (data.id_kategori == 5) {
              th = 'Video Greeting Template';
            }else if(data.id_kategori == 6){
              th = 'Video Quotes Template';
            }else if (data.id_kategori == 7) {
              th = 'Special Event Template';
            }else if (data.id_kategori == 4) {
              th = 'Product Template';
            }else if (data.id_kategori == 11) {
              th = 'Promosi Terbatas Template';
            }
            // setStorage('temp-tumb', th);
            setStorage('temp-tumb', data.thumb);
            $('#row-template').append(`
              <ons-col width="50%" class="pilih-template" data-id="${data.video}" data-url="${url}file/video/${th}/" data-thumb="${data.thumb}" style="padding:10px;">
                <img src="${url}file/video/${th}/Thumb/${data.thumb}" class="img-responsive" alt="${data.thumb}">
                <span class="text-template text-navy">${name}</span>
              </ons-col>
            `);
          });
          $('#step-pagination ul li span.prev').css({'background': '#002b3a', 'color': '#FFF'});
          $('#step-pagination ul li a.prev').css({'background': '#002b3a', 'color': '#FFF'});
          $('#step-pagination ul li span.next').css({'background': '#fdbd10'});
          $('#step-pagination ul li a.next').css({'background': '#fdbd10'});
        }
      }
      xhr.send();
      return false;
    }
  }

  if (getStorage('text-1') != null) {
    $('#text-1').val(getStorage('text-1'));
    $('#check-text-1').removeClass('hilang');
  }
  if (getStorage('text-2') != null) {
    $('#text-2').val(getStorage('text-2'));
    $('#check-text-2').removeClass('hilang');
  }
  $('#text-1').keyup(function () {
    $('#check-text-1').removeClass('hilang');
    setStorage('text-1', $('#text-1').val());
    if ($(this).val() == "") {
      $('#check-text-1').addClass('hilang');
    }
  });
  $('#text-2').keyup(function () {
    $('#check-text-2').removeClass('hilang');
    setStorage('text-2', $('#text-2').val());
    if ($(this).val() == "") {
      $('#check-text-2').addClass('hilang');
    }
  });
  $('#btn-step-1-prev').click(function () {
    myPage.resetToPage('page/step-1.html', {animation:'slide'});
  });
  $('#btn-step-1-next').click(function () {
    if ($('#text-1').val() != "" && $('#text-2').val() != "") {
      myPage.resetToPage('page/step-3.html', {animation:'slide'});
    }else{
      getNotif('Silahkan masukan text-1 & text-2 terlebih dahulu');
    }
  });

  // Step 2
  if (getStorage('template') != null) {
    $('#judul-template').text(getStorage('template'));
    $('#judul-template-2').text(getStorage('template'));
    if (getStorage('template').search('Anniversary') != -1) {
      $('#form-hide-2').show();
      $('#form-hide-3').show();
    }else{
      $('#form-hide-2').show();
      $('#form-hide-3').hide();
    }
    if (getStorage('id-template') == 5){
      $('#form-hide-preview').show();
      $('#btn-to-preview').click(function () {
        myPage.resetToPage('page/preview.html', {animation:'slide'});
      });
    }else{
      $('#form-hide-preview').hide();
    }
  }
  if (getStorage('text-3') != null) {
    $('#text-3').val(getStorage('text-3'));
    $('#check-text-3').removeClass('hilang');
  }
  if (getStorage('text-name') != null) {
    $('#text-name').val(getStorage('text-name'));
    $('#check-text-name').removeClass('hilang');
    $('#temp-name').text(getStorage('text-name'));
  }else{
    $('#text-name').val(getStorage('myname'));
    $('#check-text-name').removeClass('hilang');
    $('#temp-name').text(getStorage('myname'));
    setStorage('text-name', getStorage('myname'));
  }
  if (getStorage('text-wa') != null) {
    $('#text-wa').val(getStorage('text-wa'));
    $('#check-text-wa').removeClass('hilang');
    $('#temp-hp').text(getStorage('text-wa'));
  }

  if (getStorage('text-photo') != null) {
    if (getStorage('is_edit') != null) {
      $('#photo-fix').attr('src', url + 'file/uploads/' + getStorage('text-photo'));
    }else{
      $('#photo-fix').attr('src', './template/foto.jpg');
    }
    $('#text-photo').val(getStorage('text-photo'));
    $('#check-text-photo').removeClass('hilang');
  }else{
    $('#photo-fix').attr('src', './template/foto.jpg');
  }
  $('#text-3').keyup(function () {
    setStorage('text-3', $('#text-3').val());
    $('#check-text-3').removeClass('hilang');
    if ($(this).val() == "") {
      $('#check-text-3').addClass('hilang');
    }
  });
  $('#text-name').keyup(function () {
    setStorage('text-name', $('#text-name').val());
    $('#temp-name').text($('#text-name').val());
    $('#check-text-name').removeClass('hilang');
    if ($(this).val() == "") {
      $('#check-text-name').addClass('hilang');
    }
  });
  $('#text-wa').keyup(function () {
    setStorage('text-wa', $('#text-wa').val());
    $('#temp-hp').text($('#text-wa').val());
    $('#check-text-wa').removeClass('hilang');
    if ($(this).val() == "") {
      $('#check-text-wa').addClass('hilang');
      removeStorage('text-wa');
      $('#temp-hp').text('Nomor HP Anda');
    }
  });
  $('#file-photo').change(function () {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const filename = $('#file-photo')[0].files[0]['name'].split('.').slice(0, -1).join('.');
    const ext = $('#file-photo')[0].files[0]['name'].split('.').pop();
    if (ext == 'heic') {
      fetch(URL.createObjectURL($('#file-photo')[0].files[0]))
      .then((res) => res.blob())
      .then((blob) => heic2any({
        blob,
        toType: "image/png",
      }))
      .then((conversionResult) => {
        const url = URL.createObjectURL(conversionResult);
        window.URL.revokeObjectURL(url);
        formData.append('photo', conversionResult, filename + '.png');
        xhr.onloadstart = function () {
          $('ons-modal').show();
        }
        xhr.open("POST", `${url_api}upload-dropbox.json`, true);
        xhr.onload = function () {
          const result = JSON.parse(this.responseText);
          $('ons-modal').hide();
          if (result.status == true) {
            $('#text-photo').val(result.data.upload_data.file_name);
            setStorage('text-photo', $('#text-photo').val());
            removeStorage('is_edit');
            $('#check-text-photo').removeClass('hilang');
            myPage.resetToPage('page/editor.html', {animation:'slide'});
          }
        }
        xhr.send(formData);
      })
      .catch((e) => {
        console.log(e);
      });
    }else{
      formData.append('photo', $('#file-photo')[0].files[0]);
      xhr.onloadstart = function () {
          $('ons-modal').show();
      }
      xhr.open("POST", `${url_api}upload-dropbox.json`, true);
      xhr.onload = function () {
        const result = JSON.parse(this.responseText);
        $('ons-modal').hide();
        if (result.status == true) {
          $('#text-photo').val(result.data.upload_data.file_name);
          setStorage('text-photo', $('#text-photo').val());
          removeStorage('is_edit');
          $('#check-text-photo').removeClass('hilang');
          myPage.resetToPage('page/editor.html', {animation:'slide'});
        }
      }
      xhr.send(formData);
    }
    return false;
  });
  $('#btn-step-2-prev').click(function () {
    if (getStorage('id-template') != 5) {
      myPage.resetToPage('page/step-1.html', {animation:'slide'});
    }else{
      myPage.resetToPage('page/step-2.html', {animation:'slide'});
    }
  });
  $('#btn-step-2-next').click(function () {
    if ($('#text-3').val() != "" && $('#text-name').val() != "" && $('#text-wa').val() != "" && $('#text-photo').val() != "") {
      if (getStorage('id-template') == 4) {
        myPage.resetToPage('page/step-rendering.html', {animation:'slide'});
      }else{
        myPage.resetToPage('page/step-audio.html', {animation:'slide'});
      }
    }else{
      getNotif('Silahkan lengkapi field terlebih dahulu');
    }
  });

  // Step audio
  if (getStorage('text-audio') != null) {
    $('#text-audio').val(getStorage('text-audio'));
    $('#check-text-audio').removeClass('hilang');
  }
  getAudio = function (kategori, page) {
    $.ajax({
      url: `${url_api}sound.json`,
      type: 'GET',
      data: {kategori: kategori, page: page},
      success: function(response){
        $.each(response.data, function(index,data){
          $('#div-audio').append(`
            <ons-col width="25%" class="pilih-musik ceklis" style="padding:10px;">
              <img src="./assets/img/music.png" class="img-responsive" alt="${data.nama_musik}" data-src="${url}file/musik/${data.kategori_musik}/${data.nama_musik}">
              <span class="txt-musik" style="font-size:12px">${data.nama_musik}</span>
              <i class=""></i>
            </ons-col>
          `);
        });
        $('#show-more-audio').data('val', ($('#show-more-audio').data('val')+1));
        if (response == '') {
          $('#show-more-audio').hide();
        }
      }
    });
  }
  $('#list-audio').on('change', function () {
    $('#show-more-audio').removeClass('collapse');
    $('.pilih-musik').remove();
    $('#show-more-audio').data('val', (0));
    var kategori = $('#list-audio').val();
    getAudio(kategori, 0);
  });
  $('#show-more-audio').click(function(e){
    var kategori = $('#list-audio').val();
    e.preventDefault();
    var page = $(this).data('val');
    getAudio(kategori, page);
    $('html, body').animate({
      scrollTop: $("#show-more-audio").offset().top
    }, 1000);
  });
  var $musicSrc;
  $(document).on('click', '.pilih-musik', function () {
    setStorage('text-audio', $(this).find('img').attr('alt'));
    $musicSrc = $(this).find('img').data("src");
    $('#play-audio').attr('src', $musicSrc);
    $('#play-now').text($(this).find('img').attr('alt'));
    $('#text-audio').val($(this).find('img').attr('alt'));
    $('.ceklis').find('i').removeClass('fa fa-check-circle fa-checktest');
    $(this).find('i').addClass('fa fa-check-circle fa-checktest');
    return false;
  });
  $('#btn-step-audio-prev').click(function () {
    //myPage.resetToPage('page/step-3.html', {animation:'slide'});
    myPage.resetToPage('page/step-3.html', {animation:'slide'}).then(function () {
      if (getStorage('id-template') == 4) {
        $('#bg-product-closing').show();
        $('#bg-template-closing').hide();
        $('#img-product-closing').attr('src', url + 'file/video/Product Template/Closing/' + getStorage('temp-tumb'));
      }else if (getStorage('id-template') == 11) {
        $('#bg-product-closing').show();
        $('#bg-template-closing').hide();
        $('#img-product-closing').attr('src', url + 'file/video/Promosi Terbatas Template/Closing/' + getStorage('temp-tumb'));
      }else{
        $('#bg-product-closing').hide();
        $('#bg-template-closing').show();
      }
    })
  });
  $('#btn-step-audio-next').click(function () {
    if ($('#text-audio').val() != "") {
      myPage.resetToPage('page/step-rendering.html', {animation:'slide'});
    }else{
      getNotif('Silahkan lengkapi field terlebih dahulu');
    }
  });

  // Step Process
  $('#process-rendring').click(function () {
    const data1 = `myid=${getStorage('mytoken')}&id-template=${getStorage('id-template')}&template=${getStorage('template')}&thumb=${getStorage('thumb_template')}&text-1=&text-2=&text-3=&text-name=${getStorage('text-name')}&text-wa=${getStorage('text-wa')}&text-photo=${getStorage('text-photo')}&text-audio=${getStorage('text-audio')}`;
    const data2 = `myid=${getStorage('mytoken')}&id-template=${getStorage('id-template')}&template=${getStorage('template')}&thumb=${getStorage('thumb_template')}&text-1=${getStorage('text-1')}&text-2=${getStorage('text-2')}&text-3=${getStorage('text-3')}&text-name=${getStorage('text-name')}&text-wa=${getStorage('text-wa')}&text-photo=${getStorage('text-photo')}&text-audio=${getStorage('text-audio')}`;
    const data = (getStorage('id-template') == 5 ? data2 : data1);
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = function () {
        $('ons-modal').show();
    }
    xhr.open("POST", `${url_api}process-rendering.json`, true);
    xhr.onload = function () {
      const result = JSON.parse(this.responseText);
      $('ons-modal').hide();
      if (result.status == true) {
        removeStorage('template');
        removeStorage('text-1');
        removeStorage('text-2');
        removeStorage('text-3');
        removeStorage('text-name');
        removeStorage('text-wa');
        removeStorage('text-photo');
        removeStorage('text-audio');
        removeStorage('is_edit');
        myPage.resetToPage('page/step-onproses.html', {animation:'slide'});
      }
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    return false;
  });

  if (getStorage('mytoken') == null) {
    myPage.resetToPage('page/login.html', {animation:'slide'});
  }
});
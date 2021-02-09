$(document).ready(function () {
  const url = $('#myurl').data('url');
  const url_api = $('#myurl').data('url') + 'api/';
  const storage = window.localStorage;
  setStorage = function (key, val) {
    return storage.setItem(key, val);
  };
  getStorage = function (key) {
    return storage.getItem(key);
  };
  removeStorage = function (key) {
    return storage.removeItem(key);
  };
  getNotif = function (message) {
    ons.notification.toast(message, { timeout: 2000, animation: "ascend" });
  };
  $.getJSON("./preview.json", function (data) {
    const filename = getStorage('template').split('.').slice(0, -1).join('.');
    $('#foto-template').attr('src', 'template/kosong/' + filename + '.png');
    $(".temp-text1").text(getStorage('text-1'));
    $(".temp-text2").text(getStorage('text-2'));

    $(".area-text1").css(data[getStorage('template')]["area-text1"]);
    $(".area-text2").css(data[getStorage('template')]["area-text2"]);

    $(".temp-text1").css(data[getStorage('template')]["temp-text1"]);
    $(".temp-text2").css(data[getStorage('template')]["temp-text2"]);
    if (data[getStorage('template')]["area-text3"] != null) {
      $(".temp-text3").text(getStorage('text-3'));
      $(".temp-text3").css(data[getStorage('template')]["temp-text3"]);
      $(".area-text3").css(data[getStorage('template')]["area-text3"]);
    }
  });
  $('#btn-ok').click(function () {
    screenshot();
  });
  function screenshot(){
    html2canvas(document.getElementById('bg-template')).then(function(canvas) {
      const base64URL = canvas.toDataURL('image/jpeg').replace('image/jpeg', 'image/octet-stream');
      const data = {
        'image' : base64URL
      };
      const xhr = new XMLHttpRequest();
      xhr.onloadstart = function () {
        $('ons-modal').show();
      }
      xhr.open("POST",`${url_api}Api_tambahan/thumb`, true);
      xhr.onload = function () {
        const result = JSON.parse(this.responseText);
        $('ons-modal').hide();
        setStorage('thumb_template', 'https://sunlife.beyond-client.com/file/uploads/Thumb/' + result.img);
        myPage.resetToPage('page/step-2.html', {animation:'slide'}).then(function () {
          $.getJSON("./template.json", function (data) {
            $('#masking-text-1').text(data[getStorage('template')]["masking-text-1"]["label"]);
            $('#masking-text-2').text(data[getStorage('template')]["masking-text-2"]["label"]);
            if (data[getStorage('template')]["masking-text-3"] != null) {  
              $('#masking-text-3').text(data[getStorage('template')]["masking-text-3"]["label"]);
            }
          });
        });
      }
      xhr.send(JSON.stringify(data));
      return false;
    });
  }
  var cropper;
  const $image = $("#foto-edit");
  $image.cropper('destroy');
  $image.attr('src', url + 'file/uploads/' + getStorage('text-photo'));
  cropper = $image.cropper({
    aspectRatio: 1 / 1,
    rotatable: true,
    crop: function (event) {}
  });
  $('#rtt').click(function () {
    console.log('rtt');
    cropper.cropper('rotate', 90);
  });
  $('#btn-cropp').click(function () {
    $image.cropper('getCroppedCanvas').toBlob(function (blob) {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      const filename = getStorage('text-photo').split('.').slice(0, -1).join('.');
      formData.append('photo', blob, filename + '.png');
      xhr.onloadstart = function () {
        $('ons-modal').show();
      }
      xhr.open("POST", `${url_api}upload-dropbox.json`, true);
      xhr.onload = function () {
        const result = JSON.parse(this.responseText);
        console.log(result);
        $('ons-modal').hide();
        if (result.status == true) {
          setStorage('text-photo', result.data.upload_data.file_name);
          setStorage('is_edit', 1);
          myPage.resetToPage('page/step-3.html', {animation:'slide'}).then(function () {
            console.log(getStorage('id-template'));
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
        }
      }
      xhr.send(formData);
    });
  });
  $('#btn-to-step').click(function () {
    myPage.resetToPage('page/step-3.html', {animation:'slide'});
  });

  if (getStorage("mytoken") == null) {
    myPage.resetToPage("page/login.html", { animation: "slide" });
  }
});

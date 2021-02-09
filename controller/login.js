$(document).ready(function () {
  const storage = window.localStorage;
  const url = $('#myurl').data('url');
  const url_api = $('#myurl').data('url') + 'api/';
  if (getStorage("mytoken") != null) {
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = function () {
        $('ons-modal').show();
    }
    xhr.open("GET", `${url_api}Api_dashboard/notif`, true);
    xhr.onload = function () {
      const result = JSON.parse(this.responseText);
      $('ons-modal').hide();
      if (result.status == true) {
        if (result.notif.status == 1) {
          myPage.resetToPage("page/notif.html", { animation: "slide" });
        }else{
          myPage.resetToPage("page/dashboard.html", { animation: "slide" });
        }
      }
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send();
    return false;

  }
  $("#btn-login").click(function () {
    const data = `email=${$("#lemail").val()}&password=${$("#password").val()}`;
    const xhr = new XMLHttpRequest();
    xhr.onloadstart = function () {
        $('ons-modal').show();
    }
    xhr.open("POST", `${url_api}login.json`, true);
    xhr.onload = function () {
      const result = JSON.parse(this.responseText);
      $('ons-modal').hide();
      if (result.status == true) {
        setStorage("mytoken", result.data.serial_number);
        setStorage("myname", result.data.name);
        setStorage("myemail", result.data.email);
        setStorage("mywa", result.data.wa_number);
        setStorage("myphoto", result.data.foto_profil);
        setStorage("mydistribution", result.data.distribution);
        // setStorage("notif-server", result.notif.status);
        if (result.notif.status == 1) {
          myPage.resetToPage("page/notif.html", { animation: "slide" });
        }else{
          myPage.resetToPage("page/dashboard.html", { animation: "slide" });
        }
      }else {
        getNotif(result.message);
      }
    }
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
    return false;
  });
  $("#btn-register").click(function () {
    myPage.resetToPage("page/register.html", { animation: "slide" });
  });
  $("#name").keyup(function () {
    $("#check-name").removeClass("hilang");
    if ($(this).val() == "") {
      $("#check-name").addClass("hilang");
    }
  });
  $("#number").keyup(function () {
    $("#check-number").removeClass("hilang");
    if ($(this).val() == "") {
      $("#check-number").addClass("hilang");
    }
  });
  $("#email").keyup(function () {
    $("#check-email").removeClass("hilang");
    if ($(this).val() == "") {
      $("#check-email").addClass("hilang");
    }
  });
  $("#whatsapp").keyup(function () {
    $("#check-whatsapp").removeClass("hilang");
    if ($(this).val() == "") {
      $("#check-whatsapp").addClass("hilang");
    }
  });
  $("#rpassword").keyup(function () {
    $("#check-rpassword").removeClass("hilang");
    if ($(this).val() == "") {
      $("#check-rpassword").addClass("hilang");
    }
  });
  $("#file-photo-user").change(function () {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("photo", $("#file-photo-user")[0].files[0]);
    xhr.onloadstart = function () {
      $("ons-modal").show();
    };
    xhr.open("POST", `${url_api}upload-photo-user.json`, true);
    xhr.onload = function () {
      const result = JSON.parse(this.responseText);
      $("ons-modal").hide();
      console.log(result);
      if (result.status == true) {
        $("#photo").val(result.data.upload_data.file_name);
        $("#check-photo").removeClass("hilang");
      }
    };
    xhr.send(formData);
    return false;
  });
  $("#btn-daftar").click(function () {
    if (
      $("#name").val() != "" &&
      $("#rpassword").val() != "" &&
      $("#number").val() != "" &&
      $("#email").val() != "" &&
      $("#whatsapp").val() != "" &&
      $("#photo").val() != ""
    ) {
      $.ajax({
        url: `${url_api}regist.json`,
        type: "POST",
        data: {
          name: $("#name").val(),
          password: $("#rpassword").val(),
          serial_number: $("#number").val(),
          email: $("#email").val(),
          whatsapp: $("#whatsapp").val(),
          photo: $("#photo").val(),
        },
        success: function (response) {
          if (response.status == true) {
            getNotif(response.message);
            myPage.resetToPage("page/login.html", { animation: "slide" });
          } else {
            getNotif(response.message);
          }
        },
      });
    } else {
      getNotif("Mohon untuk melengkapi data Anda");
    }
  });
  // tools
  function setStorage(key, val) {
    return storage.setItem(key, val);
  }
  function getStorage(key) {
    return storage.getItem(key);
  }
  function removeStorage(key) {
    return storage.removeItem(key);
  }
  function getNotif(message) {
    ons.notification.toast(message, { timeout: 2000, animation: "ascend" });
  }

  $("#mybio").html(`
		<i class="fa fa-user text-yellow"></i> ${getStorage("myname")} <br/><br/>
		<i class="fa fa-user text-yellow"></i> ${getStorage("myemail")} <br/><br/> 
		<i class="fa fa-phone text-yellow"></i> ${getStorage("mywa")} <br/><br/>
	`);
});

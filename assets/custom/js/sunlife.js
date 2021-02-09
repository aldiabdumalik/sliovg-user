document.addEventListener("init", function (ev) {
  const page = ev.target;
  if (page.matches("#pg-login")) {
    $.loadScript("./controller/login.js");
  } else if (page.matches("#pg-register")) {
    $.loadScript("./controller/login.js");
  } else if (page.matches("#pg-dashboard")) {
    $.loadScript("./controller/dashboard.js");
  } else if (page.matches("#pg-notif")) {
    $.loadScript("./controller/dashboard.js");
  } else if (page.matches("#pg-step-1")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-step-2")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-step-3")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-step-audio")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-step-rendering")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-step-onproses")) {
    $.loadScript("./controller/step.js");
  } else if (page.matches("#pg-myvideo")) {
    $.loadScript("./controller/myvideo.js");
  } else if (page.matches("#pg-myvideo-edit")) {
    $.loadScript("./controller/myvideo-edit.js");
  } else if (page.matches("#pg-myvideo-detail")) {
    $.loadScript("./controller/myvideo-detail.js");
  } else if (page.matches("#pg-reporting")) {
    $.loadScript("./controller/reporting.js");
  } else if (page.matches("#pg-reporting-detail")) {
    $.loadScript("./controller/reporting-detail.js");
  } else if (page.matches("#pg-calendar")) {
    $.loadScript("./controller/calendar.js");
  } else if (page.matches("#pg-tutorial")) {
    $.loadScript("./controller/tutorial.js");
  } else if (page.matches("#pg-review")) {
    $.loadScript("./controller/review.js");
  } else if (page.matches("#pg-preview")) {
    $.loadScript("./controller/preview.js");
  } else if (page.matches("#pg-editor")) {
    $.loadScript("./controller/preview.js");
  } else {
    console.log("page not found");
  }
});
jQuery.loadScript = function (url, callback) {
  jQuery.ajax({
    url: url,
    dataType: "script",
    success: callback,
    async: true,
  });
};

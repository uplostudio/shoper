$(".is-login-popup").on("click", function () {
  $("[app='login_modal'").addClass("modal--open");
});

$("[app='login']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const errorInfo = $(this).find(".w-form-fail");
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: $("[app='login']").attr("action"),
      host: document.querySelector("[app='host']").value
    },
    success: function (data) {
      if (data.status === 1) {
        window.location.href = data.redirect;
      } else {
        console.log(data);
        errorInfo.css("display", "block");
        errorInfo.html("Podaj poprawny adres sklepu w formacie nazwasklepu.pl lub www.nazwasklepu.pl");
      }
    }
  });
});

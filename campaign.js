$("[app='open_consultation_modal_button']").on("click", function () {
  $("[app='campaign_modal']").addClass("modal--open");
});

$("[app='campaign']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const successInfo = $(this).find(".w-form-done");
  const errorInfo = $(this).find(".w-form-fail");
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: $(this).attr("action"),
      email: $(this).find("[app='email_campaign']").val(),
      phone: $(this).find("[app='phone_campaign']").val(),
      url: $(this).find("[app='url_campaign']").val()
    },
    success: function (data) {
      if (data.status === 1) {
        successInfo.css("display", "block");
        successInfo.html(
          "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!"
        );
        errorInfo.css("display", "none");
      } else {
        console.log(data);
        errorInfo.css("display", "block");
        errorInfo.html("Podaj poprawny adres sklepu w formacie nazwasklepu.pl lub www.nazwasklepu.pl");
      }
    }
  });
});

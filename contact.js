$("[app='send_contact']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const successInfo = $(this).find(".w-form-done");
  const errorInfo = $(this).find(".w-form-fail");
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "send_contact",
      name: $(this).find("[app='name_contact']").val(),
      phone: $(this).find("[app='phone_contact']").val(),
      email: $(this).find("[app='email_contact']").val(),
      url: $(this).find("[app='url_contact']").val(),
      subject: $(this).find("[app='subject_contact']").val(),
      body: $(this).find("[app='body_contact']").val()
    },
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        successInfo.css("display", "block");
        successInfo.html("Sprawdź wiadomość, którą właśnie od nas otrzymałeś!");
        errorInfo.css("display", "none");
      } else {
        errorInfo.css("display", "block");
        errorInfo.html("Coś poszło nie tak");
      }
    }
  });
});

$("[app='create_trial_step2']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const errorInfo = $(this).find(".w-form-fail");
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "create_trial_step1",
      email: localStorage.getItem("trial_email"),
      phone: $(this).find("[app='phone']").val()
    },
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        window.location.href = "https://www.shoper.pl/zaloz-sklep/";
      } else {
        errorInfo.css("display", "block");
        errorInfo.html("Podany numer jest nieprawidłowy");
      }
    }
  });
});

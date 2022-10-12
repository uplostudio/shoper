$(".is-trial-popup").on("click", function () {
  $("[app='create_trial_step1_modal']").addClass("modal--open");
});

$("[app='create_trial_step1']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  localStorage.setItem("trial_email", $(this).find("[app='email']").val());
  const form = this;
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "create_trial_step1",
      email: $(this).find("[app='email']").val()
    },
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        $("[app='trial_simple']").removeClass("modal--open");
        $("[modal='create_trial_step2']").addClass("modal--open");
        $("[app='trial-domain']").html(data.host);
      } else {
        $(form).find(".w-form-fail").css("display", "block");
        $(form).find(".w-form-fail").html("Podany email jest nieprawidłowy");
        if (data.code === 2) {
          $(form)
            .find(".w-form-fail")
            .html(
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie."
            );
        }
      }
    }
  });
});

window.addEventListener("load", () => {
  $("[app='open_migrate_modal_button']").on("click", function () {
    $("[app='migration_modal']").addClass("modal--open");
  });

  //  grab form
  formWrappers = document.querySelectorAll("[app='migration']");
  // grab form trigger

  formWrappers.forEach((n) => {
    phoneInput = n.querySelector("[app='phone_campaign']");
    emailInput = n.querySelector("[app='email_campaign']");
    formTrigger = n.querySelector("[app='migration-submit']");
    let action = n.getAttribute("action");

    phoneInput.addEventListener("blur", checkPhoneBlurTwo);

    emailInput.addEventListener("blur", checkMailBlurTwo);

    formTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      formWrapper = this.form;
      phoneInput = formWrapper.querySelector("[app='phone_campaign']");
      emailInput = formWrapper.querySelector("[app='email_campaign']");

      checkPhoneBlur();
      checkEmailBlur();

      if (outcomeOne && outcomeTwo) {
        $.ajax({
          url: "https://www.shoper.pl/ajax.php",
          headers: {},
          method: "POST",
          data: {
            action: action,
            email: emailValue,
            phone: phoneInputValue,
          },
          success: function (data) {
            if (data.status === 1) {
              n.querySelector("form").style.display = "none";
              n.parentElement.querySelector(".w-form-done").style.display =
                "block";
              n.parentElement.querySelector(".w-form-done").textContent =
                "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
              n.querySelector("form").reset();
            } else {
              n.parentElement.querySelector(".w-form-fail").style.display =
                "block";
            }
          },
        });
      } else {
      }
    });
  });
});

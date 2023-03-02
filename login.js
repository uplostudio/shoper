// Required Attributes: form[app='login'], input[app='host']

$("[app='open_login_modal_button']").on("click", function () {
  $("[app='login_modal'").addClass("modal--open");
});
try {
  //  grab form
  formWrapper = document.querySelector("[app='login']");
  // grab form trigger
  formTrigger = formWrapper.querySelector("[app='login_submit']");
  // grab all input fields from form without checkboxes
  hostInput = formWrapper.querySelector("[app='host']");

  // Attach EventListeners to inputs

  hostInput.addEventListener("blur", function () {
    checkHostBlur();
  });

  // Attach EventListener to submit button

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    checkHostBlur();

    let rawValue = hostInput.value;
    let validDomain;
    const regex = /www.*/gm;
    let match = rawValue.match(regex);

    if (match !== null) {
      let rawSplittedValue = match[0].split(".");
      let rawShifted = rawSplittedValue.shift();
      validDomain = rawSplittedValue.join(".");
    } else {
      validDomain = rawValue;
    }

    if (checkHostBlur()) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: $("[app='login']").attr("action"),
          host: validDomain,
        },

        success: function (data) {
          if (data.status === 1) {
            window.location.href = data.redirect;
          } else {
            formWrapper.parentElement.querySelector(
              ".w-form-fail"
            ).style.display = "block";
            formWrapper.parentElement.querySelector(
              ".w-form-fail"
            ).textContent = "Podaj poprawny adres sklepu lub domeny roboczej";
          }
        },
      });
    } else {
    }
  });
} catch (err) {}

// Custom banner & custom modal
try {
  let customBanner = document.querySelector("[app='custom_banner']");

  customBanner.addEventListener("click", () => {
    let customModal = document.querySelector("[app='bannerModal']");
    customModal.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
} catch (err) {}
//  grab form
formWrapper = document.querySelector("[app='custom_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='bcm-submit']");
// grab all input fields from form without checkboxes
phoneInput = formWrapper.querySelector("[app='phone_campaign']");
emailInput = formWrapper.querySelector("[app='email_campaign']");

// phoneInput.addEventListener("keydown", createEnterKeydownHandler(phoneInput, formTrigger));
// emailInput.addEventListener("keydown", createEnterKeydownHandler(emailInput, formTrigger));

// Attach EventListeners to inputs

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  formWrapper = e.target.closest("form");
  loader = formWrapper.querySelector(".loading-in-button");

  checkEmailBlur();
  checkPhoneBlur();

  if (checkEmailBlur() && checkPhoneBlur()) {
    loader.style.display = "block";
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "bcm22-2",
        subject: "Gotowy sklep i konsultacja Shoper",
        send: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS9iMGs3cnBxLw==",
        phone: phoneInputValue,
        email: emailValue,
      },
      success: function (data) {
        loader.style.display = "none";
        formWrapper.querySelector("form").style.display = "none";
        formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
        formWrapper.querySelector("form").reset();
      },
      error: function (data) {
        loader.style.display = "none";
        formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
        formWrapper.parentElement.querySelector(".w-form-fail").textContent = "Coś poszło nie tak, spróbuj ponownie.";
      },
    });
  } else {
  }
});

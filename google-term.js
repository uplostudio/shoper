window.addEventListener("load", () => {
  //  grab form
  formWrappers = document.querySelectorAll("[app='google-terms']");
  // grab form trigger

  formWrappers.forEach((n) => {
    firstNameInput = n.querySelector("[app='name_contact']");
    emailInput = n.querySelector("[app='email_campaign']");
    phoneInput = n.querySelector("[app='phone_campaign']");
    urlInput = n.querySelector("[app='url_contact']");
    let companyNameInput = n.querySelector("[app='company_name']");
    formTrigger = n.querySelector("[app='submit-terms']");
    let action = n.getAttribute("action");

    firstNameInput.addEventListener("blur", function () {
      checkFirstNameBlur();
    });

    emailInput.addEventListener("blur", function () {
      checkEmailBlur();
    });

    phoneInput.addEventListener("blur", function () {
      checkPhoneBlur();
    });

    urlInput.addEventListener("blur", function () {
      checkUrlBlurRegexRequired();
    });

    formTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      formWrapper = e.target.closest("form");
      loader = formWrapper.querySelector(".loading-in-button");
      // formWrapper = this.form;

      checkFirstNameBlur();
      checkEmailBlur();
      checkPhoneBlur();
      checkUrlBlurRegexRequired();

      let AdsTerms = formWrapper.querySelector("[name='terms']");

      if (!AdsTerms.checked) {
        AdsTerms.previousElementSibling.style.border = errorBorderColor;
        AdsTerms.parentNode.nextElementSibling.style.display = "flex";
        AdsTerms.value = 0;
      } else {
        AdsTerms.previousElementSibling.style.border = initialBorderColor;
        AdsTerms.parentNode.nextElementSibling.style.display = "none";
        AdsTerms.value = 1;
      }

      if (checkFirstNameBlur() && checkPhoneBlur() && checkEmailBlur() && checkUrlBlurRegex() && AdsTerms.checked) {
        loader.style.display = "block";
        $.ajax({
          url: "https://www.shoper.pl/ajax.php",
          headers: {},
          method: "POST",
          data: {
            action: action,
            name: firstNameValue,
            email: emailValue,
            phone: phoneInputValue,
            url: urlValue,
            nip: nipValue,
            company_name: companyValue,
            accept_agree: AdsTerms,
            zapier: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS8zNm93N3I5Lw",
          },
          success: function (data) {
            if (data.status === 1) {
              loader.style.display = "none";
              n.querySelector("form").style.display = "none";
              n.parentElement.querySelector(".w-form-done").style.display = "block";
              // n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
              n.querySelector("form").reset();
            } else {
              loader.style.display = "none";
              n.parentElement.querySelector(".w-form-fail").style.display = "block";
            }
          },
        });
      } else {
      }
    });
  });
});

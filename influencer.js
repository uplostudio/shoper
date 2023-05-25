let url;

// this prevents from form not being sent properly without clicking first on the url input field
outcomeThree = true;

//  grab form
formWrappers = document.querySelectorAll("[app='campaign']");
// grab form trigger

formWrappers.forEach((n) => {
  phoneInput = n.querySelector("[app='phone_campaign']");
  emailInput = n.querySelector("[app='email_campaign']");
  urlInput = n.querySelector("[app='url_campaign']");
  formTrigger = n.querySelector("[app='consult-submit']");
  let action = n.getAttribute("action");

  phoneInput.addEventListener("keydown", createEnterKeydownHandler(phoneInput, formTrigger));
  emailInput.addEventListener("keydown", createEnterKeydownHandler(emailInput, formTrigger));
  urlInput.addEventListener("keydown", createEnterKeydownHandler(urlInput, formTrigger));

  phoneInput.addEventListener("blur", checkPhoneBlurTwo);
  emailInput.addEventListener("blur", checkMailBlurTwo);
  urlInput.addEventListener("blur", checkUrlBlurTwoNonRequired);

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    formWrapper = e.target.closest("form");
    loader = formWrapper.querySelector(".loading-in-button");
    phoneInput = formWrapper.querySelector("[app='phone_campaign']");
    emailInput = formWrapper.querySelector("[app='email_campaign']");
    urlInput = formWrapper.querySelector("[app='url_campaign']");

    checkUrlBlurNonRequired();
    checkPhoneBlur();
    checkEmailBlur();

    let createTerms = formWrapper.querySelectorAll("[name='create_or_move_shop']")[0];
    let moveTerms = formWrapper.querySelector("[name='create_or_move_shop']")[1];
    let cooperateTerms = formWrapper.querySelector("[name='want_to_cooperate_with_shops']");

    if (!createTerms.checked) {
      // createTerms.previousElementSibling.style.border = errorBorderColor;
      //   bruttocreateTermserms.parentNode.nextElementSibling.style.display = "flex";
      createTerms.value = 0;
    } else {
      // createTerms.previousElementSibling.style.border = initialBorderColor;
      // createTerms.parentNode.nextElementSibling.style.display = "none";
      createTerms.value = 1;
    }
    if (!moveTerms.checked) {
      //   bruttoClause.previousElementSibling.style.border = errorBorderColor;
      //   bruttoClause.parentNode.nextElementSibling.style.display = "flex";
      moveTerms.value = 0;
    } else {
      //   bruttoClause.previousElementSibling.style.border = initialBorderColor;
      //   bruttoClause.parentNode.nextElementSibling.style.display = "none";
      moveTerms.value = 1;
    }
    if (!cooperateTerms.checked) {
      //   shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
      //   shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
      cooperateTerms.value = 0;
    } else {
      //   shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
      //   shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
      cooperateTerms.value = 1;
    }

    if (outcomeOne && outcomeTwo && outcomeThree) {
      loader.style.display = "block";

      $.ajax({
        url: url,
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          name_account: urlValue,
          create_or_move_shop: createTerms.value,
          create_or_move_shop: moveTerms.value,
          want_to_cooperate_with_shops: cooperateTerms.value,
        },
        success: function (data) {
          // notification attribute goes in ms ads form
          loader.style.display = "none";
          if (data.status === 1 && formWrapper.parentElement.hasAttribute("notification")) {
            n.parentElement.querySelector(".w-form-fail").style.background = "#4faf3f";
            n.parentElement.querySelector(".w-form-fail").style.display = "block";
            // n.parentElement.querySelector(".w-form-fail").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          } else {
            n.querySelector("form").style.display = "none";
            n.parentElement.querySelector(".w-form-done").style.display = "block";
            // n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          }
        },
        error: function () {
          loader.style.display = "none";
          n.parentElement.querySelector(".w-form-fail").style.display = "block";
          n.parentElement.querySelector(".w-form-fail").style.background = "#ff2c00";
        },
      });
    } else {
    }
  });
});

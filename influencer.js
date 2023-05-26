$("[data-app='open_create_shop']").on("click", function () {
  $("[data-app='create-shop']").addClass("modal--open");
});

$("[data-app='open_cooperate']").on("click", function () {
  $("[data-app='cooperate']").addClass("modal--open");
});

// this prevents from form not being sent properly without clicking first on the url input field
outcomeThree = true;

//  grab form
formWrappers = document.querySelectorAll("[app='influencer']");
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
    let moveTerms = formWrapper.querySelectorAll("[name='create_or_move_shop']")[1];
    let cooperateTerms = formWrapper.querySelectorAll("[name='create_or_move_shop']")[2];

    if (!createTerms.checked) {
      // createTerms.previousElementSibling.style.border = errorBorderColor;
      //   bruttocreateTermserms.parentNode.nextElementSibling.style.display = "flex";
      createTerms.value = "";
    } else {
      // createTerms.previousElementSibling.style.border = initialBorderColor;
      // createTerms.parentNode.nextElementSibling.style.display = "none";
      createTerms.value = createTerms.nextElementSibling.textContent;
    }
    if (!moveTerms.checked) {
      //   bruttoClause.previousElementSibling.style.border = errorBorderColor;
      //   bruttoClause.parentNode.nextElementSibling.style.display = "flex";
      moveTerms.value = "";
    } else {
      //   bruttoClause.previousElementSibling.style.border = initialBorderColor;
      //   bruttoClause.parentNode.nextElementSibling.style.display = "none";
      moveTerms.value = moveTerms.nextElementSibling.textContent;
    }
    if (!cooperateTerms.checked) {
      //   shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
      //   shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
      cooperateTerms.value = "";
    } else {
      //   shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
      //   shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
      cooperateTerms.value = cooperateTerms.nextElementSibling.textContent;
    }

    if (outcomeOne && outcomeTwo && outcomeThree) {
      loader.style.display = "block";

      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          name_account: urlValue,
          "create_or_move_shop[0]": createTerms.value,
          "create_or_move_shop[1]": moveTerms.value,
          "create_or_move_shop[2]": cooperateTerms.value,
          zapier: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS8zNmVjaWxxLw==",
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

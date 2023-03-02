//  grab form
formWrapper = document.querySelector("[app='booste_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='booste_submit']");
// grab all input fields from form without checkboxes
firstNameInput = formWrapper.querySelector("[app='firstName']");
lastNameInput = formWrapper.querySelector("[app='lastName']");
emailInput = formWrapper.querySelector("[app='email']");
urlInput = formWrapper.querySelector("[app='url']");

// Attach EventListeners to inputs

firstNameInput.addEventListener("blur", function () {
  checkFirstNameBlur();
});

lastNameInput.addEventListener("blur", function () {
  checkLastNameBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

// Attach EventListener to submit button

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkFirstNameBlur();
  checkLastNameBlur();
  checkEmailBlur();
  checkUrlBlur();

  let shoperTermsEmail = formWrapper.querySelector(
    "[name='shoper_terms_email']"
  );
  let shoperTermsSms = formWrapper.querySelector("[name='shoper_terms_sms']");
  let shoperTermsTel = formWrapper.querySelector("[name='shoper_terms_tel']");
  let acceptAgree = formWrapper.querySelector("[name='accept_agree']");
  let boosteTermsEmail = formWrapper.querySelector(
    "[name='booste_terms_email']"
  );
  let boosteTermsSms = formWrapper.querySelector("[name='booste_terms_sms']");
  let boosteTermsTel = formWrapper.querySelector("[name='booste_terms_tel']");

  if (!acceptAgree.checked) {
    acceptAgree.parentElement.children[0].style.border = errorBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "flex";
  } else {
    acceptAgree.parentElement.children[0].style.border = initialBorderColor;
    acceptAgree.parentElement.parentElement.nextElementSibling.style.display =
      "none";
  }

  if (shoperTermsEmail.checked) {
    shoperTermsEmail.value = 1;
  } else {
    shoperTermsEmail.value = "";
  }

  if (shoperTermsSms.checked) {
    shoperTermsSms.value = 1;
  } else {
    shoperTermsSms.value = "";
  }

  if (shoperTermsTel.checked) {
    shoperTermsTel.value = 1;
  } else {
    shoperTermsTel.value = "";
  }

  if (boosteTermsEmail.checked) {
    boosteTermsEmail.value = 1;
  } else {
    boosteTermsEmail.value = "";
  }

  if (boosteTermsSms.checked) {
    boosteTermsSms.value = 1;
  } else {
    boosteTermsSms.value = "";
  }

  if (boosteTermsTel.checked) {
    boosteTermsTel.value = 1;
  } else {
    boosteTermsTel.value = "";
  }

  const body = new FormData();
  body.append("firstname", firstNameValue);
  body.append("lastname", lastNameValue);
  body.append("email", emailValue);
  body.append("website", urlValue);
  body.append("shoper_terms_email", shoperTermsEmail.value);
  body.append("shoper_terms_sms", shoperTermsSms.value);
  body.append("shoper_terms_tel", shoperTermsTel.value);
  body.append("booste_terms_email", boosteTermsEmail.value);
  body.append("booste_terms_sms", boosteTermsSms.value);
  body.append("booste_terms_tel", boosteTermsTel.value);
  body.append("accept_agree", "1");
  body.append("country", "PL");
  body.append("referer_url", "https://shoper.pl/finansowanie/booste");

  if (
    checkFirstNameBlur() &&
    checkLastNameBlur() &&
    checkEmailBlur() &&
    checkUrlBlur() &&
    acceptAgree.checked
  ) {
    fetch(`https://hooks.zapier.com/hooks/catch/492789/bke9mgj/`, {
      body: body,
      action: "https://app.booste.com/sign-up",
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        let status = data.status;
        if (status === "success") {
          formWrapper.querySelector("form").reset();
          window.location.href = `https://app.booste.com/sign-up?firstname=${firstNameValue}&lastname=${lastNameValue}&email=${emailValue}&website=${urlValue}`;
        } else {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.querySelector(".w-form-fail").style.display = "block";
        }
      });
  }
});

//  grab form
formWrapper = document.querySelector("[app='google-terms']");
let action = formWrapper.getAttribute("action");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='submit-terms']");
// grab all input fields from form without checkboxes
firstNameInput = formWrapper.querySelector("[app='name_contact']");
emailInput = formWrapper.querySelector("[app='email_contact']");
phoneInput = formWrapper.querySelector("[app='phone_contact']");
urlInput = formWrapper.querySelector("[app='url_contact']");
let companyNameInput = formWrapper.querySelector("[app='company_name']");
nipInput = formWrapper.querySelector("[app='nipNumber']");
let successInfo = formWrapper.querySelector(".w-form-done");
let errorInfo = formWrapper.querySelector(".w-form-fail");

// Attach EventListeners to inputs

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

  console.log(AdsTerms.value);

  if (checkFirstNameBlur() && checkEmailBlur() && checkPhoneBlur() && checkUrlBlurRegexRequired() && AdsTerms.value === "1") {
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
        nip: nipInput.value,
        company_name: companyNameInput.value,
        accept_agree: AdsTerms.value,
        terms_url: "https://www.shoper.pl/static/regulaminy/regulamin-microsoft-advert-z.pdf",
        zapier: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS8zNm9neWNqLw==",
      },
      success: function (data) {
        if (data.status === 1) {
          loader.style.display = "none";
          formWrapper.parentElement.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
          formWrapper.parentElement.querySelector("form").reset();
        } else {
          loader.style.display = "none";
          formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
        }
      },
      error: function (data) {},
    });
  } else {
  }
});

//  grab form
formWrapper = document.querySelector("[app='send_contact']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='submit-contact']");
// grab all input fields from form without checkboxes
firstNameInput = formWrapper.querySelector("[app='name_contact']");
phoneInput = formWrapper.querySelector("[app='phone_contact']");
emailInput = formWrapper.querySelector("[app='email_contact']");
urlInput = formWrapper.querySelector("[app='url_contact']");
textArea = formWrapper.querySelector("[app='body_contact']");
let subjectInput = formWrapper.querySelector("[app='subject_contact']");
let subjectValue = subjectInput.value;
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

textArea.addEventListener("blur", function () {
  checkTextAreaBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlurRegex();
});

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  checkFirstNameBlur();
  checkEmailBlur();
  checkPhoneBlur();
  checkTextAreaBlur();
  checkUrlBlurRegex();

  if (
    checkFirstNameBlur() &&
    checkEmailBlur() &&
    checkPhoneBlur() &&
    checkTextAreaBlur() &&
    checkUrlBlurRegex()
  ) {
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "send_contact",
        name: firstNameValue,
        phone: phoneInputValue,
        email: emailValue,
        url: urlValue,
        subject: subjectValue,
        body: textArea.value,
      },
      success: function (data) {
        if (data.status === 1) {
          formWrapper.querySelector("form").style.display = "none";
          formWrapper.parentElement.querySelector(
            ".w-form-done"
          ).style.display = "block";
          formWrapper.querySelector("form").reset();
        } else {
          formWrapper.parentElement.querySelector(
            ".w-form-fail"
          ).style.display = "block";
        }
      },
      error: function (data) {},
    });
  } else {
  }
});

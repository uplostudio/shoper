//  grab form
formWrapper = document.querySelector("[app='brutto_form']");
// grab form trigger
formTrigger = formWrapper.querySelector("[app='brutto_submit']");
// grab all input fields from form without checkboxes
nipInput = formWrapper.querySelector("[app='nipNumber']");
phoneInput = formWrapper.querySelector("[app='phone']");
emailInput = formWrapper.querySelector("[app='email']");
urlInput = formWrapper.querySelector("[app='url']");

// Attach EventListeners to inputs

nipInput.addEventListener("blur", function () {
  checkNipBlur();
});

phoneInput.addEventListener("blur", function () {
  checkPhoneBlur();
});

emailInput.addEventListener("blur", function () {
  checkEmailBlur();
});

urlInput.addEventListener("blur", function () {
  checkUrlBlur();
});

formWrapper.setAttribute("action", "loan_decision_contact");

// Attach EventListener to submit button

formTrigger.addEventListener("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  formWrapper = e.target.closest("form");
  loader = formWrapper.querySelector(".loading-in-button");

  checkNipBlur();
  checkPhoneBlur();
  checkEmailBlur();
  checkUrlBlur();

  let bruttoTerms = formWrapper.querySelector("[name='brutto_terms']");
  let bruttoClause = formWrapper.querySelector("[name='brutto_info_clause']");
  let shoperPersonalData = formWrapper.querySelector("[name='shoper_personal_data']");

  if (!bruttoTerms.checked) {
    bruttoTerms.previousElementSibling.style.border = errorBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "flex";
    bruttoTerms.value = 0;
  } else {
    bruttoTerms.previousElementSibling.style.border = initialBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "none";
    bruttoTerms.value = 1;
  }
  if (!bruttoClause.checked) {
    bruttoClause.previousElementSibling.style.border = errorBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "flex";
    bruttoClause.value = 0;
  } else {
    bruttoClause.previousElementSibling.style.border = initialBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "none";
    bruttoClause.value = 1;
  }
  if (!shoperPersonalData.checked) {
    shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
    shoperPersonalData.value = 0;
  } else {
    shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
    shoperPersonalData.value = 1;
  }

  const body = new FormData();
  body.append("nipValue", nipValue);
  body.append("url", urlValue);
  body.append("phone", phoneInputValue);
  body.append("email", emailValue);
  body.append("bruttoTerms", bruttoTerms.value);
  body.append("bruttoClause", bruttoClause.value);
  body.append("shoperPersonalData", shoperPersonalData.value);
  body.append("action", formWrapper.getAttribute("action"));

  if (checkNipBlur() && checkPhoneBlur() && checkEmailBlur() && checkUrlBlur() && bruttoTerms.checked && bruttoClause.checked && shoperPersonalData.checked) {
    loader.style.display = "block";
    fetch(`https://www.shoper.pl/ajax.php`, {
      body,
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    }).then(function (response) {
      loader.style.display = "none";
      formWrapper.querySelector("form").style.display = "none";
      formWrapper.querySelector(".w-form-done").style.display = "block";
    });
  } else {
  }
});

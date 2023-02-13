$("[app='brutto_submit']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;

  let bruttoTerms = form.querySelector("[name='brutto_terms']");
  let bruttoClause = form.querySelector("[name='brutto_info_clause']");
  let shoperPersonalData = form.querySelector("[name='shoper_personal_data']");

  useRegexPhone(phoneInputValue);
  useRegexNip(nipValue);
  useRegexEmail(emailValue);
  useRegexUrl(urlValue);

  checkNip(e);
  checkPhone(e);
  checkEmail(e);
  checkUrl(e);

  if (!bruttoTerms.checked) {
    bruttoTerms.previousElementSibling.style.border = errorBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "flex";
    bruttoTerms.value === 0;
  } else {
    bruttoTerms.previousElementSibling.style.border = initialBorderColor;
    bruttoTerms.parentNode.nextElementSibling.style.display = "none";
    bruttoTerms.value === 1;
  }
  if (!bruttoClause.checked) {
    bruttoClause.previousElementSibling.style.border = errorBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "flex";
    bruttoClause.value === 0;
  } else {
    bruttoClause.previousElementSibling.style.border = initialBorderColor;
    bruttoClause.parentNode.nextElementSibling.style.display = "none";
    bruttoClause.value === 1;
  }
  if (!shoperPersonalData.checked) {
    shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
    shoperPersonalData.value === 0;
  } else {
    shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
    shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
    shoperPersonalData.value === 1;
  }

  const body = new FormData();
  body.append("nipValue", nipValue);
  body.append("url", urlValue);
  body.append("phone", phoneInputValue);
  body.append("email", emailValue);
  body.append("bruttoTerms", bruttoTerms.value);
  body.append("bruttoClause", bruttoClause.value);
  body.append("shoperPersonalData", shoperPersonalData.value);
  body.append("action", "loan_decision_contact");

  if (
    useRegexPhone(phoneInputValue) &&
    useRegexEmail(emailValue) &&
    useRegexNip(nipValue) &&
    useRegexUrl(urlValue) &&
    bruttoTerms.checked &&
    bruttoClause.checked &&
    shoperPersonalData.checked
  ) {
    fetch(`https://www.shoper.pl/ajax.php`, {
      body,
      headers: {
        Accept: "*/*",
      },
      method: "POST",
    }).then(function (response) {
      form.style.display = "none";
      form.parentElement.querySelector(".w-form-done").style.display = "block";
    });
  } else {
  }
});

// let formWrapper = document.querySelector("[app='brutto_form']");
// let nipInput = formWrapper.querySelector("[app='nipNumber']");
// let phoneInput = formWrapper.querySelector("[app='phone']");
// let emailInput = formWrapper.querySelector("[app='email']");
// let urlInput = formWrapper.querySelector("[app='url']");

// console.log(emailInput)

// function checkNipBlur() {
//   // let nipInput = document.querySelector("[app='nipNumber']");
//   nipValue = nipInput.value;
//   let errorBoxNip = nipInput.nextElementSibling;
//   if (nipValue === "") {
//     nipInput.style.border = errorBorderColor;
//     errorBoxNip.style.display = "flex";
//     errorBoxNip.children[1].textContent = "To pole jest wymagane";
//       return false
//   } else if (!useRegexNip(nipValue)) {
//     nipInput.style.border = errorBorderColor;
//     errorBoxNip.style.display = "flex";
//     errorBoxNip.children[1].textContent = "Podaj poprawne dane";
//       return false
//   } else if (useRegexNip(nipValue)) {
//     nipInput.style.border = initialBorderColor;
//     errorBoxNip.style.display = "none";
//       return true
//   }
// }

// function checkPhoneBlur() {
//   phoneInputValue = phoneInput.value;
//   let errorBoxPhone = phoneInput.nextElementSibling;
//   if (phoneInputValue === "") {
//     phoneInput.style.border = errorBorderColor;
//     errorBoxPhone.style.display = "flex";
//     errorBoxPhone.children[1].textContent = "To pole jest wymagane";
//       return false
//   } else if (!useRegexPhone(phoneInputValue)) {
//     phoneInput.style.border = errorBorderColor;
//     errorBoxPhone.style.display = "flex";
//     errorBoxPhone.children[1].textContent = "Podaj poprawne dane";
//       return false
//   } else if (useRegexPhone(phoneInputValue)) {
//     phoneInput.style.border = initialBorderColor;
//     errorBoxPhone.style.display = "none";
//       return true
//   }
// }

// function checkEmailBlur() {
//   emailValue = emailInput.value;
//   let errorBoxEmail = emailInput.nextElementSibling;
//   if (emailValue === "") {
//     emailInput.style.border = errorBorderColor;
//     errorBoxEmail.style.display = "flex";
//     errorBoxEmail.children[1].textContent = "To pole jest wymagane";
//       return false
//   } else if (!useRegexEmail(emailValue)) {
//     emailInput.style.border = errorBorderColor;
//     errorBoxEmail.style.display = "flex";
//     errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
//       return false
//   } else if (useRegexEmail(emailValue)) {
//     emailInput.style.border = initialBorderColor;
//     errorBoxEmail.style.display = "none";
//       return true
//   }
// }

// function checkUrlBlur() {
//   urlValue = urlInput.value;
//   let errorBoxUrl = urlInput.nextElementSibling;
//   if (urlValue === "") {
//     urlInput.style.border = errorBorderColor;
//     errorBoxUrl.style.display = "flex";
//     errorBoxUrl.children[1].textContent = "To pole jest wymagane";
//       return false
//   } else if (!useRegexUrl(urlValue)) {
//     urlInput.style.border = errorBorderColor;
//     errorBoxUrl.style.display = "flex";
//     errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
//       return false
//   } else if (useRegexUrl(urlValue)) {
//     urlInput.style.border = initialBorderColor;
//     errorBoxUrl.style.display = "none";
//       return true
//   }
// }

// nipInput.addEventListener("blur", function() {
//    checkNipBlur()
// })

// phoneInput.addEventListener("blur", function() {
//    checkPhoneBlur()
// })

// emailInput.addEventListener("blur", function() {
//    checkEmailBlur()
// })

// urlInput.addEventListener("blur", function() {
//    checkUrlBlur()
// })

// $("[app='brutto_submit']").on("click", function(e) {
//     e.preventDefault();
//     e.stopPropagation();

//     let form = e.target.form;

//     let bruttoTerms = form.querySelector("[name='brutto_terms']");
//     let bruttoClause = form.querySelector("[name='brutto_info_clause']");
//     let shoperPersonalData = form.querySelector("[name='shoper_personal_data']");

//     if (!bruttoTerms.checked) {
//         bruttoTerms.previousElementSibling.style.border = errorBorderColor;
//         bruttoTerms.parentNode.nextElementSibling.style.display = "flex";
//         bruttoTerms.value === 0;
//     } else {
//         bruttoTerms.previousElementSibling.style.border = initialBorderColor;
//         bruttoTerms.parentNode.nextElementSibling.style.display = "none";
//         bruttoTerms.value === 1;
//     }
//     if (!bruttoClause.checked) {
//         bruttoClause.previousElementSibling.style.border = errorBorderColor;
//         bruttoClause.parentNode.nextElementSibling.style.display = "flex";
//         bruttoClause.value === 0;
//     } else {
//         bruttoClause.previousElementSibling.style.border = initialBorderColor;
//         bruttoClause.parentNode.nextElementSibling.style.display = "none";
//         bruttoClause.value === 1;
//     }
//     if (!shoperPersonalData.checked) {
//         shoperPersonalData.previousElementSibling.style.border = errorBorderColor;
//         shoperPersonalData.parentNode.nextElementSibling.style.display = "flex";
//         shoperPersonalData.value === 0;
//     } else {
//         shoperPersonalData.previousElementSibling.style.border = initialBorderColor;
//         shoperPersonalData.parentNode.nextElementSibling.style.display = "none";
//         shoperPersonalData.value === 1;
//     }

//     const body = new FormData();
//     body.append("nipValue", nipValue);
//     body.append("url", urlValue);
//     body.append("phone", phoneInputValue);
//     body.append("email", emailValue);
//     body.append("bruttoTerms", bruttoTerms.value);
//     body.append("bruttoClause", bruttoClause.value);
//     body.append("shoperPersonalData", shoperPersonalData.value);

//     if (checkNipBlur() && checkPhoneBlur() && checkEmailBlur() && checkUrlBlur() && bruttoTerms.checked && bruttoClause.checked && shoperPersonalData.checked) {
//         fetch(`https://www.shoper.pl/ajax.php`, {
//             body,
//             headers: {
//                 Accept: "*/*",
//             },
//             method: "POST",
//         }).then(function(response) {
//             form.style.display = "none";
//             form.parentElement.querySelector(".w-form-done").style.display = "block";
//         });
//     } else {}
// });

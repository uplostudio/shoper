$("[app='brutto_submit']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;
  let nipInput = form.querySelector("[app='nipNumber']");
  let nipValue = nipInput.value;
  let errorBoxNip = nipInput.nextElementSibling;
  let phoneInput = form.querySelector("[app='phone']");
  let phoneInputValue = phoneInput.value;
  let errorBoxPhone = phoneInput.nextElementSibling;
  let emailInput = form.querySelector("[app='email']");
  let emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  let urlInput = form.querySelector("[app='url']");
  let urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;

  let bruttoTerms = form.querySelector("[name='brutto_terms']");
  let bruttoClause = form.querySelector("[name='brutto_info_clause']");
  let shoperPersonalData = form.querySelector("[name='shoper_personal_data']");

  function useRegexPhone(phoneInputValue) {
    let regex = /^\d\d\d\d\d\d\d\d\d$/;
    return regex.test(phoneInputValue);
  }

  function useRegexNip(nipValue) {
    let regex = /^\d\d\d\d\d\d\d\d\d$/;
    return regex.test(nipValue);
  }

  function useRegexEmail(emailValue) {
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailValue);
  }

  if (nipValue === "") {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexNip(nipValue)) {
    nipInput.style.border = errorBorderColor;
    errorBoxNip.style.display = "flex";
    errorBoxNip.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexNip(nipValue)) {
    nipInput.style.border = initialBorderColor;
    errorBoxNip.style.display = "none";
  }

  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
    errorBoxEmail.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexEmail(emailValue)) {
    emailInput.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
  }

  if (phoneInputValue === "") {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
    errorBoxPhone.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexPhone(phoneInputValue)) {
    phoneInput.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
  }

  if (urlValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
  } else {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
  }

  if (!bruttoTerms.checked) {
    bruttoTerms.parentElement.children[0].style.border = errorBorderColor;
    bruttoTerms.parentElement.children[0].style.display = "flex";
    bruttoTerms.parentElement.children[0].textContent = "To pole jest wymagane";
    bruttoTerms.value === 0;
  } else {
    bruttoTerms.parentElement.children[0].style.border = initialBorderColor;
    bruttoTerms.parentElement.children[0].style.display = "none";
    bruttoTerms.value === 1;
    return bruttoTerms.value;
  }
  if (!bruttoClause.checked) {
    bruttoClause.parentElement.children[0].style.border = errorBorderColor;
    bruttoClause.parentElement.children[0].style.display = "flex";
    bruttoClause.parentElement.children[0].textContent =
      "To pole jest wymagane";
    bruttoClause.value === 0;
  } else {
    bruttoClause.parentElement.children[0].style.border = initialBorderColor;
    bruttoClause.parentElement.children[0].style.display = "none";
    bruttoClause.value === 1;
    return bruttoClause.value;
  }
  if (!shoperPersonalData.checked) {
    shoperPersonalData.parentElement.children[0].style.border =
      errorBorderColor;
    shoperPersonalData.parentElement.children[0].style.display = "flex";
    shoperPersonalData.parentElement.children[0].textContent =
      "To pole jest wymagane";
    shoperPersonalData.value === 0;
  } else {
    shoperPersonalData.parentElement.children[0].style.border =
      initialBorderColor;
    shoperPersonalData.parentElement.children[0].style.display = "none";
    shoperPersonalData.value === 1;
    return shoperPersonalData.value;
  }

  const body = new FormData();
  body.append("nipValue", nipValue);
  body.append("url", urlValue);
  body.append("phone", phoneInputValue);
  body.append("email", emailValue);
  body.append("bruttoTerms", bruttoTerms.value);
  body.append("bruttoClause", bruttoClause.value);
  body.append("shoperPersonalData", shoperPersonalData.value);

  if (
    useRegexPhone(phoneInputValue) &&
    useRegexEmail(emailValue) &&
    nipValue !== "" &&
    urlInput !== "" &&
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
      console.log(response.status);
    });
  } else {
  }
});

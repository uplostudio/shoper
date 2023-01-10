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

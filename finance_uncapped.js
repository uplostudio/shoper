let formNextStepBtn = document.querySelector("[multi='next_step']");
let formPrevStepBtn = document.querySelector("[multi='prev_step']");
let prevSlideBtn = document.querySelector("[multi='arrow_prev']");
let nextSlideBtn = document.querySelector("[multi='arrow_next']");
let uncappedSubmit = document.querySelector("[multi='submit']");

let positive = false;

formPrevStepBtn.addEventListener("click", () => {
  prevSlideBtn.click();
});

formNextStepBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
});

uncappedSubmit.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;
  // first step
  let countryInput = form.querySelector("[multi='country']");
  let countryValue = countryInput.value;
  let errorBoxCountry = countryInput.nextElementSibling;
  let monthlyIncomeInput = form.querySelector("[multi='monthly_euro_income']");
  let monthlyIncomeValue = monthlyIncomeInput.value;
  let erroBoxMonthlyIncome = monthlyIncomeInput.nextElementSibling;
  let businessTypeInput = form.querySelector(
    "[multi='business_activity_type']"
  );
  let businessTypeValue = businessTypeInput.value;
  let errorBoxBusinessType = businessTypeInput.nextElementSibling;
  // second step

  let privacyTerms = document.querySelector("[name='privacy']");
  let overallTerms = document.querySelector("[name='terms']");

  let nextSlideBtn = form.querySelector("[multi='arrow_next']");
  let prevPrevBtn = form.querySelector("[multi='arrow_prev']");

  if (!privacyTerms.checked) {
    privacyTerms.parentElement.children[0].style.border = errorBorderColor;
    privacyTerms.parentElement.parentElement.children[1].style.display = "flex";
    privacyTerms.value === 0;
  } else {
    privacyTerms.parentElement.children[0].style.border = initialBorderColor;
    privacyTerms.parentElement.parentElement.children[1].style.display = "none";
    privacyTerms.value === 1;
  }

  if (!overallTerms.checked) {
    overallTerms.parentElement.children[0].style.border = errorBorderColor;
    overallTerms.parentElement.parentElement.children[1].style.display = "flex";
    overallTerms.value === 0;
  } else {
    overallTerms.parentElement.children[0].style.border = initialBorderColor;
    overallTerms.parentElement.parentElement.children[1].style.display = "none";
    overallTerms.value === 1;
  }

  checkCompanyName(e);
  useRegexFirstName(firstNameValue);
  checkFirstName(e);
  useRegexLastName(lastNameValue);
  checkLastName(e);
  useRegexUrl(urlValue);
  checkUrl(e);
  useRegexEmail(emailValue);
  checkEmail(e);
  useRegexPhone(phoneInputValue);
  checkPhone(e);

  const body = new FormData();
  body.append("companyName", companyValue);
  body.append("url", urlValue);
  body.append("country", countryValue);
  body.append("monthlyEuroIncome", monthlyIncomeValue);
  body.append("BusinessActivityType", businessTypeValue);
  body.append("firstName", firstNameValue);
  body.append("lastName", lastNameValue);
  body.append("email", emailValue);
  body.append("phone", phoneInputValue);
  body.append("acceptAgree", privacyTerms.value);
  body.append("acceptInfo", overallTerms.value);

  if (
    companyValue !== "" &&
    useRegexUrl(urlValue) &&
    useRegexFirstName(firstNameValue) &&
    useRegexLastName(lastNameValue) &&
    useRegexEmail(emailValue) &&
    useRegexPhone(phoneInputValue) &&
    privacyTerms.checked
  ) {
    fetch(`https://www.shoper.pl/ajax.php`, {
      body,
      action: "financing_uncapped",
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

setInterval(function () {
  let companyNameInput = document.querySelector("[app='company_name']");
  let companyValue = companyNameInput.value;
  let urlInput = document.querySelector("[app='url']");
  let urlValue = urlInput.value;

  if (useRegexUrl(urlValue) && companyValue !== "") {
    formNextStepBtn.classList.remove("inactive");
    positive = true;
  } else {
    formNextStepBtn.classList.add("inactive");
    positive = false;
  }

  console.log(positive);

  if (positive) {
    formNextStepBtn.style.pointerEvents = "auto";
    // formPrevStepBtn.addEventListener("click", () => {
    //   prevSlideBtn.click();
    // });
    formNextStepBtn.addEventListener("click", () => {
      nextSlideBtn.click();
    });
  } else {
    formNextStepBtn.style.pointerEvents = "none";
  }
}, 1000);

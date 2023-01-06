let formNextStepBtn = document.querySelector("[multi='next_step']");
let formPrevStepBtn = document.querySelector("[multi='prev_step']");
let prevSlideBtn = document.querySelector("[multi='arrow_prev']");
let nextSlideBtn = document.querySelector("[multi='arrow_next']");
let positive = false;

formNextStepBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;
  // first step
  let companyNameInput = form.querySelector("[multi='company_name']");
  let companyValue = companyNameInput.value;
  let errorBoxName = companyNameInput.nextElementSibling;
  let urlInput = form.querySelector("[multi='url']");
  let urlInputValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;
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
  let firstNameInput = form.querySelector("[multi='first_name']");
  let firstNameValue = firstNameInput.value;
  let errorBoxFirstName = firstNameInput.nextElementSibling;
  let lastNameInput = form.querySelector("[multi='last_name']");
  let lastNameInputValue = lastNameInput.value;
  let errorBoxLastName = lastNameInput.nextElementSibling;
  let emailInput = form.querySelector("[multi='email']");
  let emailInputValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  let phoneNumberInput = form.querySelector("[multi='phone']");
  let phoneNumberInputValue = phoneNumberInput.value;
  let errorBoxPhoneNumber = phoneNumberInput.nextElementSibling;

  let nextSlideBtn = form.querySelector("[multi='arrow_next']");
  let prevPrevBtn = form.querySelector("[multi='arrow_prev']");

  if (companyValue === "") {
    companyNameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
  } else {
    companyNameInput.style.border = initialBorderColor;
    errorBoxName.style.display = "none";
  }

  if (urlInputValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
  } else {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
  }
});

setInterval(function () {
  let companyNameInput = document.querySelector("[multi='company_name']");
  let companyValue = companyNameInput.value;
  let urlInput = document.querySelector("[multi='url']");
  let urlInputValue = urlInput.value;
  if (urlInputValue !== "" && companyValue !== "") {
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

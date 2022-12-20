$("[multi='next_step']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;
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
  let monthlyIncomeValue = monthlyIncome.value;
  let erroBoxMonthlyIncome = monthlyIncomeInput.nextElementSibling;
  let businessTypeInput = form.querySelector(
    "[multi='business_activity_type']"
  );
  let businessTypeValue = businessTypeInput.value;
  let errorBoxBusinessType = businessTypeInput.nextElementSibling;

  let nextSlideBtn = form.querySelector("[multi='arrow_next']");
  let prevPrevBtn = form.querySelector("[multi='arrow_prev']");

  //   let formNextStepBtn = form.querySelector("[multi='next_step']");

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

  if (urlInputValue !== "" && companyValue !== "") {
    e.target.classList.remove("inactive");
    nextSlideBtn.click();
  }
});

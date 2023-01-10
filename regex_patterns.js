let phoneInputValue,
  nipValue,
  emailValue,
  urlValue,
  firstNameValue,
  lastNameValue,
  companyValue;

let errorBorderColor = `1px solid #eb4826`;
let initialBorderColor = `1px solid #898989`;

function useRegexFirstName(firstNameValue) {
  let regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(firstNameValue);
}
function useRegexLastName(lastNameValue) {
  let regex =
    /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/;
  return regex.test(lastNameValue);
}

function useRegexPhone(phoneInputValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d$/;
  return regex.test(phoneInputValue);
}

function useRegexNip(nipValue) {
  let regex = /^\d\d\d\d\d\d\d\d\d\d$/;
  return regex.test(nipValue);
}

function useRegexEmail(emailValue) {
  let regex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(emailValue);
}

function useRegexUrl(urlValue) {
  let regex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  return regex.test(urlValue);
}

function checkFirstName(e) {
  let form = e.target.form;
  let firstNameInput = form.querySelector("[app='firstName']");
  firstNameValue = firstNameInput.value;
  let errorBoxFirstName = firstNameInput.nextElementSibling;
  if (firstNameValue === "") {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = errorBorderColor;
    errorBoxFirstName.style.display = "flex";
    errorBoxFirstName.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexFirstName(firstNameValue)) {
    firstNameInput.style.border = initialBorderColor;
    errorBoxFirstName.style.display = "none";
  }
}
function checkLastName(e) {
  let form = e.target.form;
  let lastNameInput = form.querySelector("[app='lastName']");
  lastNameValue = lastNameInput.value;
  let errorBoxLastName = lastNameInput.nextElementSibling;
  if (lastNameValue === "") {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = errorBorderColor;
    errorBoxLastName.style.display = "flex";
    errorBoxLastName.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexLastName(lastNameValue)) {
    lastNameInput.style.border = initialBorderColor;
    errorBoxLastName.style.display = "none";
  }
}

function checkCompanyName(e) {
  let form = e.target.form;
  let companyNameInput = form.querySelector("[app='company_name']");
  companyValue = companyNameInput.value;
  let errorBoxCompany = companyNameInput.nextElementSibling;
  if (companyValue === "") {
    companyNameInput.style.border = errorBorderColor;
    errorBoxCompany.style.display = "flex";
    errorBoxCompany.children[1].textContent = "To pole jest wymagane";
  } else {
    companyNameInput.style.border = initialBorderColor;
    errorBoxCompany.style.display = "none";
  }
}

function checkNip(e) {
  let form = e.target.form;
  let nipInput = form.querySelector("[app='nipNumber']");
  nipValue = nipInput.value;
  let errorBoxNip = nipInput.nextElementSibling;
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
}
function checkEmail(e) {
  let form = e.target.form;
  let emailInput = form.querySelector("[app='email']");
  emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
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
}

function checkPhone(e) {
  let form = e.target.form;
  let phoneInput = form.querySelector("[app='phone']");
  phoneInputValue = phoneInput.value;
  let errorBoxPhone = phoneInput.nextElementSibling;
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
}

function checkUrl(e) {
  let form = e.target.form;
  let urlInput = form.querySelector("[app='url']");
  urlValue = urlInput.value;
  let errorBoxUrl = urlInput.nextElementSibling;
  if (urlValue === "") {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "To pole jest wymagane";
  } else if (!useRegexUrl(urlValue)) {
    urlInput.style.border = errorBorderColor;
    errorBoxUrl.style.display = "flex";
    errorBoxUrl.children[1].textContent = "Podaj poprawne dane";
  } else if (useRegexUrl(urlValue)) {
    urlInput.style.border = initialBorderColor;
    errorBoxUrl.style.display = "none";
  }
}

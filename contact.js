$("[app='submit-contact']").on("click", function (e) {
  e.preventDefault();
  e.stopPropagation();

  let form = e.target.form;
  let nameInput = form.querySelector("[app='name_contact']");
  let nameValue = nameInput.value;
  let errorBoxName = nameInput.nextElementSibling;
  let emailInput = form.querySelector("[app='email_contact']");
  let emailValue = emailInput.value;
  let errorBoxEmail = emailInput.nextElementSibling;
  let phoneInput = form.querySelector("[app='phone_contact']");
  let phoneValue = phoneInput.value;
  let errorBoxPhone = phoneInput.nextElementSibling;
  let bodyInput = form.querySelector("[app='body_contact']");
  let bodyValue = bodyInput.value;
  let errorBoxBody = bodyInput.nextElementSibling;
  let urlInput = form.querySelector("[app='url_contact']");
  let urlValue = urlInput.value;
  let subjectInput = form.querySelector("[app='subject_contact']");
  let subjectValue = subjectInput.value;
  let allInputs = Array.from(form.getElementsByTagName("input"));

  function useRegexName(nameValue) {
    let regex =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return regex.test(nameValue);
  }

  function useRegexEmail(emailValue) {
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(emailValue);
  }

  function useRegexPhone(phoneValue) {
    let regex = /^\d\d\d\d\d\d\d\d\d$/;
    return regex.test(phoneValue);
  }

  if (nameValue === "") {
    nameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
  } else if (!useRegexName(nameValue)) {
    nameInput.style.border = errorBorderColor;
    errorBoxName.style.display = "flex";
  } else if (useRegexName(nameValue)) {
    nameInput.style.border = initialBorderColor;
    errorBoxName.style.display = "none";
  }

  if (emailValue === "") {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
  } else if (!useRegexEmail(emailValue)) {
    emailInput.style.border = errorBorderColor;
    errorBoxEmail.style.display = "flex";
  } else if (useRegexEmail(emailValue)) {
    emailInput.style.border = initialBorderColor;
    errorBoxEmail.style.display = "none";
  }

  if (phoneValue === "") {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
  } else if (!useRegexPhone(phoneValue)) {
    phoneInput.style.border = errorBorderColor;
    errorBoxPhone.style.display = "flex";
  } else if (useRegexPhone(phoneValue)) {
    phoneInput.style.border = initialBorderColor;
    errorBoxPhone.style.display = "none";
  }

  if (bodyValue === "") {
    bodyInput.style.border = errorBorderColor;
    errorBoxBody.style.display = "flex";
  } else {
    bodyInput.style.border = initialBorderColor;
    errorBoxBody.style.display = "none";
  }

  const successInfo = document.querySelector(".w-form-done");
  const errorInfo = document.querySelector(".w-form-fail");

  if (
    useRegexName(nameValue) &&
    useRegexEmail(emailValue) &&
    useRegexPhone(phoneValue) &&
    bodyValue !== ""
  ) {
    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "send_contact",
        name: nameValue,
        phone: phoneValue,
        email: emailValue,
        url: urlValue,
        subject: subjectValue,
        body: bodyValue,
      },
      success: function (data) {
        if (data.status === 1) {
          form.style.display = "none";
          form.parentElement.querySelector(".w-form-done").style.display =
            "block";
          allInputs.forEach((n) => {
            n.value = "";
          });
        } else {
          form.parentElement.querySelector(".w-form-fail").style.display =
            "block";
        }
      },
      error: function (data) {},
    });
  } else {
  }
});

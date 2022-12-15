// blackfriday modal & contact

let sendBcmForm = document.querySelectorAll("[app='bcm']");
let sendBcmButton = document.querySelectorAll("[app='bcm-submit']");
// let errorBorderColor = `1px solid #eb4826`;
// let initialBorderColor = `1px solid #898989`;
let form;
let parentForm;

sendBcmButton.forEach((n) => {
  n.addEventListener("click", (e) => {
    form = e.target.form;
    parentForm = form.parentNode;
    let inputInFormPhone = form.querySelector("[app='phone_campaign']");
    let phoneValue = inputInFormPhone;
    let inputInFormEmail = form.querySelector("[app='email_campaign']");
    let emailValue = inputInFormEmail;
    let errorBoxPhone = inputInFormPhone.parentNode.lastChild;
    let errorBoxMail = inputInFormEmail.parentNode.lastChild;

    function useRegexPhone(phoneValue) {
      let regex = /^\d\d\d\d\d\d\d\d\d$/;
      return regex.test(phoneValue);
    }

    function useRegexEmail(emailValue) {
      let regex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(emailValue);
    }

    if (phoneValue.value === "") {
      inputInFormPhone.style.border = errorBorderColor;
      errorBoxPhone.style.display = "flex";
    } else if (!useRegexPhone(phoneValue.value)) {
      inputInFormPhone.style.border = errorBorderColor;
      errorBoxPhone.style.display = "flex";
    } else if (useRegexPhone(phoneValue.value)) {
      inputInFormPhone.style.border = initialBorderColor;
      errorBoxPhone.style.display = "none";
    }

    if (emailValue.value === "") {
      inputInFormEmail.style.border = errorBorderColor;
      errorBoxMail.style.display = "flex";
    } else if (!useRegexEmail(emailValue.value)) {
      inputInFormEmail.style.border = errorBorderColor;
      errorBoxMail.style.display = "flex";
    } else if (useRegexEmail(emailValue.value)) {
      inputInFormEmail.style.border = initialBorderColor;
      errorBoxMail.style.display = "none";
    }
  });
});

sendBcmForm.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      url: "https://www.shoper.pl/ajax.php",
      headers: {},
      method: "POST",
      data: {
        action: "bcm22-2",
        subject: "Bezpłatna konsultacja Shoper",
        send: "aHR0cHM6Ly9ob29rcy56YXBpZXIuY29tL2hvb2tzL2NhdGNoLzQ5Mjc4OS9iMGs3cnBxLw==",
        phone: n.querySelector("[app='phone_campaign']").value,
        email: n.querySelector("[app='email_campaign']").value,
      },
      success: function (data) {
        form.style.display = "none";
        let successBox = parentForm.querySelector(".success-message");
        successBox.style.display = "flex";
      },
    });
  });
});

let banner = document.querySelectorAll("#black-friday-banner");
banner.forEach((n) => {
  n.addEventListener("click", () => {
    let bf = document.querySelector("#black-friday");
    bf.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
});

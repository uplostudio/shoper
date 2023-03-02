// $("[app='open_consultation_modal_button']").on("click", function () {
//   $("[app='campaign_modal']").addClass("modal--open");
// });

// $("[app='consult-submit']").on("click", function (e) {
//   e.preventDefault();
//   e.stopPropagation();

//   let form = e.target.form;
//   let phoneInput = form.querySelector("[app='phone_campaign']");
//   let emailInput = form.querySelector("[app='email_campaign']");
//   let urlInput = form.querySelector("[app='url_campaign']");
//   let urlValue = urlInput.value;
//   let emailValue = emailInput.value;
//   let phoneValue = phoneInput.value;
//   let errorBoxPhone = phoneInput.nextElementSibling;
//   let errorBoxMail = emailInput.nextElementSibling;
//   let errorBoxUrl = urlInput.parentNode.nextElementSibling;

//   function useRegexPhone(phoneValue) {
//     let regex = /^\d\d\d\d\d\d\d\d\d$/;
//     return regex.test(phoneValue);
//   }

//   function useRegexEmail(emailValue) {
//     let regex =
//       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return regex.test(emailValue);
//   }

//   function useRegexUrl(urlValue) {
//     let regex = /[a-zA-Z][a-zA-Z]/gm;
//     return regex.test(urlValue);
//   }

//   if (phoneValue.value === "") {
//     phoneInput.style.border = errorBorderColor;
//     errorBoxPhone.style.display = "flex";
//   } else if (!useRegexPhone(phoneValue)) {
//     phoneInput.style.border = errorBorderColor;
//     errorBoxPhone.style.display = "flex";
//   } else if (useRegexPhone(phoneValue)) {
//     phoneInput.style.border = initialBorderColor;
//     errorBoxPhone.style.display = "none";
//   }

//   if (emailValue.value === "") {
//     emailInput.style.border = errorBorderColor;
//     errorBoxMail.style.display = "flex";
//   } else if (!useRegexEmail(emailValue)) {
//     emailInput.style.border = errorBorderColor;
//     errorBoxMail.style.display = "flex";
//   } else if (useRegexEmail(emailValue)) {
//     emailInput.style.border = initialBorderColor;
//     errorBoxMail.style.display = "none";
//   }

//   if (urlValue.value === "") {
//     urlInput.style.border = errorBorderColor;
//     errorBoxUrl.style.display = "flex";
//   } else if (!useRegexUrl(urlValue)) {
//     urlInput.style.border = errorBorderColor;
//     errorBoxUrl.style.display = "flex";
//   } else if (useRegexUrl(urlValue)) {
//     urlInput.style.border = initialBorderColor;
//     errorBoxUrl.style.display = "none";
//   }

//   const successInfo = form.parentNode.querySelector(".w-form-done");
//   const errorInfo = form.parentNode.querySelector(".w-form-fail");

//   // console.log(phoneValue, emailValue, urlValue)
//   //     console.log(useRegexPhone(phoneValue))
//   //     console.log(useRegexEmail(emailValue))
//   //     console.log(useRegexUrl(urlValue))

//   if (
//     useRegexPhone(phoneValue) &&
//     useRegexEmail(emailValue) &&
//     useRegexUrl(urlValue)
//   ) {
//     $.ajax({
//       url: "https://www.shoper.pl/ajax.php",
//       headers: {},
//       method: "POST",
//       data: {
//         action: form.parentNode.getAttribute("action"),
//         email: emailValue,
//         phone: phoneValue,
//         url: urlValue,
//       },
//       success: function (data) {
//         // console.log(data);
//         if (data.status === 1) {
//           form.style.display = "none";
//           successInfo.style.display = "block";
//           successInfo.textContent =
//             "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
//           errorInfo.style.display = "none";
//         } else {
//           // console.log(data);
//           errorInfo.style.display = "block";
//           errorInfo.textContent =
//             "Podaj poprawny adres sklepu w formacie nazwasklepu.pl lub www.nazwasklepu.pl";
//         }
//       },
//     });
//   } else {
//   }
// });

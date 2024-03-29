let url;

$("[app='open_consultation_modal_button']").on("click", function () {
  $("[app='campaign_modal']").addClass("modal--open");
  $(document.body).toggleClass("overflow-hidden", true);
});

// this prevents from form not being sent properly without clicking first on the url input field
outcomeThree = true;

//  grab form
formWrappers = document.querySelectorAll("[app='campaign']");
// grab form trigger

formWrappers.forEach((n) => {
  phoneInput = n.querySelector("[app='phone_campaign']");
  emailInput = n.querySelector("[app='email_campaign']");
  urlInput = n.querySelector("[app='url_campaign']");
  formTrigger = n.querySelector("[app='consult-submit']");
  let action = n.getAttribute("action");
  let subject = n.getAttribute("subject");

  phoneInput.addEventListener("keydown", createEnterKeydownHandler(phoneInput, formTrigger));
  emailInput.addEventListener("keydown", createEnterKeydownHandler(emailInput, formTrigger));
  urlInput.addEventListener("keydown", createEnterKeydownHandler(urlInput, formTrigger));

  phoneInput.addEventListener("blur", checkPhoneBlurTwo);
  emailInput.addEventListener("blur", checkMailBlurTwo);
  urlInput.addEventListener("blur", checkUrlBlurTwoNonRequired);

  formTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    formWrapper = e.target.closest("form");
    loader = formWrapper.querySelector(".loading-in-button");
    phoneInput = formWrapper.querySelector("[app='phone_campaign']");
    emailInput = formWrapper.querySelector("[app='email_campaign']");
    urlInput = formWrapper.querySelector("[app='url_campaign']");

    checkUrlBlurNonRequired();
    checkPhoneBlur();
    checkEmailBlur();

    if (outcomeOne && outcomeTwo && outcomeThree) {
      loader.style.display = "block";
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form sent",
          eventAction: e.target.value,
          eventLabel: window.location.pathname,
        };

        dataLayer.push(data);
      }

      if (window.location.pathname === "/shoper-rekomendacje/") {
        url = "https://hooks.zapier.com/hooks/catch/492789/32z68mh/";
      } else {
        url = "https://www.shoper.pl/ajax.php";
      }

      $.ajax({
        url: url,
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          url: urlValue,
          subject: subject,
          thulium_id: this.closest("form").getAttribute("thulium_id"),
          zapier: this.closest("form").getAttribute("zapier"),
        },
        success: function (data) {
          // notification attribute goes in ms ads form
          loader.style.display = "none";
          if (data.status === 1 && formWrapper.parentElement.hasAttribute("notification")) {
            formWrapper.parentElement.querySelector(".w-form-fail").style.background = "#4faf3f";
            formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
            // n.parentElement.querySelector(".w-form-fail").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            formWrapper.reset();
          } else {
            formWrapper.style.display = "none";
            formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
            // n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            formWrapper.reset();
          }
        },
        error: function () {
          loader.style.display = "none";
          formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
          formWrapper.parentElement.querySelector(".w-form-fail").style.background = "#ff2c00";
        },
      });
    } else {
      if (window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "Button modal form error",
          eventAction: e.target.value,
          eventLabel: window.location.pathname,
        };

        dataLayer.push(data);
      }
    }
  });
});

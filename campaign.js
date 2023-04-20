$("[app='open_consultation_modal_button']").on("click", function () {
  $("[app='campaign_modal']").addClass("modal--open");
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
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: action,
          email: emailValue,
          phone: phoneInputValue,
          url: urlValue,
          thulium_id: this.closest("form").getAttribute("thulium_id"),
          zapier: this.closest("form").getAttribute("zapier"),
        },
        success: function (data) {
          // notification attribute goes in ms ads form
          loader.style.display = "none";
          if (data.status === 1 && formWrapper.parentElement.hasAttribute("notification")) {
            n.parentElement.querySelector(".w-form-fail").style.background = "#4faf3f";
            n.parentElement.querySelector(".w-form-fail").style.display = "block";
            n.parentElement.querySelector(".w-form-fail").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          } else {
            n.querySelector("form").style.display = "none";
            n.parentElement.querySelector(".w-form-done").style.display = "block";
            n.parentElement.querySelector(".w-form-done").textContent = "Sprawdź wiadomość, którą właśnie od nas otrzymałeś!";
            n.querySelector("form").reset();
          }
        },
        error: function () {
          loader.style.display = "none";
          n.parentElement.querySelector(".w-form-fail").style.display = "block";
          n.parentElement.querySelector(".w-form-fail").style.background = "#ff2c00";
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

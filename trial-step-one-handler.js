window.myGlobals = {
  clientId: null,
  host: null,
  shopId: null,
};

$(document).ready(function () {
  let state = {
    errors: [],
    analyticsId: "",
    gclidValue: getOrStoreParameter("gclid"),
    fbclidValue: getOrStoreParameter("fbclid"),
    emailRegex: new RegExp(
      '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    ),
  };

  function getOrStoreParameter(name) {
    let urlSearchParams = new URLSearchParams(window.location.search);
    let urlValue = urlSearchParams.get(name) || "";
    let storedValue = localStorage.getItem(name);

    if (urlValue) {
      if (urlValue !== storedValue) {
        localStorage.setItem(name, urlValue);
      }
      return urlValue;
    } else if (storedValue) {
      return storedValue;
    }
    return "";
  }

  function updateAnalytics() {
    setTimeout(function () {
      try {
        const tracker = ga.getAll()[0];
        state.analyticsId = tracker.get("clientId");
        $("[name='analytics_id']").val(state.analyticsId);
      } catch (err) {}
    }, 2000);
  }

  function setupValidation() {
    const emailField = $('[data-action="create_trial_step1"] [data-type="email"]');
    emailField.on("blur", function () {
      state.errors = validateEmail(this, state.errors, state.emailRegex);
    });

    emailField.on("keydown", function (e) {
      if (e.which === 13) {
        emailField.trigger("blur");
        onSubmitClick(e);
      }
    });
  }

  function validateEmail(field, errors, emailRegex) {
    let email = $(field).val();
    $(field).removeClass("error");

    if (!email) {
      $(field).addClass("error").next(".for-empty").show();
      errors.push("Email is required.");
    } else if (!emailRegex.test(email)) {
      $(field).addClass("error").next(".for-invalid").show();
      errors.push("Email is invalid.");
    }
    return errors;
  }

  function onSubmitClick(e) {
    state.errors = [];

    const statusMessages = {
      2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
      3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
      4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
    };

    let emailField = $('[data-action="create_trial_step1"] [data-type="email"]');
    emailField.trigger("blur");
    const wFormFail = $('[data-app="create_trial_step1"]').find(".w-form-fail")[0];

    if (state.errors.length === 0) {
      $.ajax({
        type: "POST",
        url: "https://www.shoper.pl/ajax.php",
        data: {
          action: $("#create_trial_step1").attr("data-action"),
          email: emailField.val(),
          "adwords[gclid]": state.gclidValue,
          "adwords[fbclid]": state.fbclidValue,
          analyticsId: state.analyticsId,
        },
        success: function (data) {
          if (data.code > 0) {
            $(wFormFail).text(statusMessages[data.code]);
            $(wFormFail).show();
          }

          if (data.client_id) window.myGlobals.clientId = data.client_id;
          if (data.host) window.myGlobals.host = data.host;
          if (data.shop_id) window.myGlobals.shopId = data.shop_id;

          if (data.status === 1) {
            $('[data-app="create_trial_step1_modal"]').addClass("modal--open");
          }
        },
        error: function (data) {
          console.log("Error: Something went wrong");
          $(wFormFail).hide();
        },
      });
    } else {
      e.preventDefault();
      console.log(state.errors);
    }
  }

  updateAnalytics();
  setupValidation();

  $('[data-form="submit-step-one"]').on("click", function (e) {
    onSubmitClick(e);
  });
});

// let client_id;

// let inputVals;
// let inputValsArr = [];
// let inputValsArrFiltered;

// // beforeunload
// // formAbandon
// const dataLayer = window.dataLayer || [];
// const formAbandonHandler = () => {
//   const inputValsArr = Array.from(trialStepOneEmailInputs)
//     .map((n) => n.value)
//     .filter((el) => el.length > 1);
//   if (inputValsArr.length > 0) {
//     const element = document.querySelector("[data-app='create_trial_step1']");
//     const elementId = element.getAttribute("data-app");
//     const data = {
//       event: "formAbandon",
//       formId: elementId,
//       eventHistory: window.history,
//     };
//     dataLayer.push(data);
//   }
// };
// window.addEventListener("beforeunload", formAbandonHandler);

// trialOpenButton.forEach((n) => {
//   n.addEventListener("click", () => {
//     trialStepOneModal.classList.add("modal--open");
//     $(document.body).toggleClass("overflow-hidden", true);
//   });
// });

// trialStepOneEmailInputs.forEach((n) => {
//   n.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       this.blur();
//       const submitTrigger = this.form.querySelector("[data-app='submit-step-one']");
//       submitTrigger.click();
//     }
//   });
//   // Control Blur Step One
//   n.addEventListener("blur", function () {
//     checkEmailBlurTrialStepOne(n);

//     const element = document.querySelector("[data-app='create_trial_step1']");
//     const elementId = element.getAttribute("data-app");
//     const data = {
//       event: "controlBlur",
//       formId: elementId,
//       controlName: n.getAttribute("data-app"),
//       controlType: n.type,
//       controlValue: n.value,
//     };
//     dataLayer.push(data);
//   });
//   // Control Focus Step One
//   n.addEventListener("focus", () => {
//     const element = document.querySelector("[data-app='create_trial_step1']");
//     const elementId = element.getAttribute("data-app");
//     const data = {
//       event: "controlFocus",
//       formId: elementId,
//       controlName: n.getAttribute("data-app"),
//       controlType: n.type,
//       controlValue: n.value,
//     };
//     dataLayer.push(data);
//   });
// });

// const createTrialStepOne = document.querySelectorAll("[data-app='submit-step-one']");

// const handleFormSubmitSuccess = (data, form, client_id) => {
//   const errorInfo = $(form).parent().find(".w-form-fail");
//   const errorMessages = {
//     3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
//     2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
//     4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
//   };
//   if (errorMessages[data.code]) {
//     errorInfo.children[0].innerHTML = errorMessages[data.code];
//     errorInfo.css("display", "block");
//     loader.css("display", "none");
//   } else if (data.code === 1 || data.status === 1) {
//     trialStepOneModal.classList.remove("modal--open");
//     const trialDomain = document.querySelector("[app='trial-domain']");
//     trialDomain.innerHTML = data.host;
//     document.querySelector("[data-modal='create_trial_step2']").classList.add("modal--open");
//     loader.css("display", "none");
//     $(document.body).css("overflow", "hidden");

//     dataLayer.push({
//       event: "trial_EmailSubmitted",
//       client_id,
//       "shop-id": data.shop_id,
//       formId: form.parentElement.getAttribute("data-app"),
//       email: emailValue,
//     });

//     dataLayer.push({
//       eventName: "formSubmitSuccess",
//       formId: form.parentElement.getAttribute("data-app"),
//       eventCategory: "Button form sent",
//       eventLabel: window.location.pathname,
//       eventType: emailValue,
//       eventHistory: window.history,
//     });

//     dataLayer.push({
//       event: "myTrackEvent",
//       formId: form.parentElement.getAttribute("data-app"),
//       eventCategory: "Button form sent",
//       eventAction: form.querySelector("[data-app='submit-step-one']").textContent,
//       eventType: emailValue,
//       eventLabel: window.location.pathname,
//     });
//   } else {
//     dataLayer.push({
//       eventName: "formSubmitError",
//       formId: form.parentElement.getAttribute("data-app"),
//       eventCategory: "Button form error",
//       eventAction: form.querySelector("[data-app='submit-step-one']").textContent,
//       eventLabel: window.location.pathname,
//       eventType: emailValue,
//       eventHistory: window.history,
//     });

//     dataLayer.push({
//       event: "myTrackEvent",
//       formId: form.parentElement.getAttribute("data-app"),
//       eventCategory: "Button form error",
//       eventAction: form.querySelector("[data-app='submit-step-one']").textContent,
//       eventType: emailValue,
//       eventLabel: window.location.pathname,
//     });
//   }
// };

// createTrialStepOne.forEach((el) => {
//   el.addEventListener("click", (e) => {
//     e.preventDefault();
//     const form = el.closest("form");
//     loader = el.querySelector(".loading-in-button");

//     if (result) {
//       loader.style.display = "block";
//       $.ajax({
//         url: "https://www.shoper.pl/ajax.php",
//         headers: {},
//         method: "POST",
//         xhrFields: {
//           withCredentials: true,
//         },
//         data: {
//           action: "create_trial_step1",
//           email: emailValue,
//           analytics_id: analyticsIdInputValue.value,
//           "adwords[gclid]": gclidValue,
//           "adwords[fbclid]": fbclidValue,
//         },
//         success: function (data) {
//           const client_id = data.client_id;
//           handleFormSubmitSuccess(data, form, client_id);
//         },
//       });
//     } else {
//     }
//   });
// });

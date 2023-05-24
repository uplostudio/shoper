let gclidInput, gclidValue, fbclidInput, fbclidValue, regexp, regexpFb, locationG, locationGFb, match, matchFb;
let analyticsId;
let analyticsIdInputValue = document.querySelector("[name='analitycs_id']");
let isFromBanner = false;
let client_id;
let loader;
let splited;

// Prevent forms from being sent when user hits enter

// document.addEventListener("keydown", function (event) {
//   if (event.key === "Enter") {
//     event.preventDefault();
//   }
// });

// gclid

regexp = /[?&]gclid=([^&]+)/gm;
locationG = window.location.search;
match = locationG.match(regexp);

if (match !== null) {
  splited = match[0].split("=");
  if (splited.length > 0) {
    gclidValue = splited[1];
    localStorage.setItem("gclid", gclidValue);
    gclidInput = document.querySelector("[name='adwords[gclid]']");
    gclidInput.setAttribute("value", gclidValue);
  } else if (localStorage.gclid === undefined) {
    gclidValue = "";
    gclidInput = document.querySelector("[name='adwords[gclid]']");
    gclidInput.setAttribute("value", gclidValue);
  }
} else if (localStorage.gclid !== "undefined") {
  gclidValue = localStorage.gclid;
  gclidInput = document.querySelector("[name='adwords[gclid]']");
  gclidInput.setAttribute("value", gclidValue);
}

if (localStorage.gclid === undefined) {
  gclidValue = "";
  gclidInput = document.querySelector("[name='adwords[gclid]']");
  gclidInput.setAttribute("value", gclidValue);
}

// fbclid

regexpFb = /[?&]fbclid=([^&]+)/gm;
locationGFb = window.location.search;
matchFb = locationGFb.match(regexpFb);
if (matchFb !== null) {
  splited = matchFb[0].split("=");
  if (splited.length > 0) {
    fbclidValue = splited[1];
    localStorage.setItem("fbclid", fbclidValue);
    fbclidInput = document.querySelector("[name='adwords[fbclid]']");
    fbclidInput.setAttribute("value", fbclidValue);
  } else if (localStorage.fbclid === undefined) {
    fbclidValue = "";
    fbclidInput = document.querySelector("[name='adwords[fbclid]']");
    fbclidInput.setAttribute("value", fbclidValue);
  }
} else if (localStorage.fbclid !== "undefined") {
  fbclidValue = localStorage.fbclid;
  fbclidInput = document.querySelector("[name='adwords[fbclid]']");
  fbclidInput.setAttribute("value", fbclidValue);
}

if (localStorage.fbclid === undefined) {
  fbclidValue = "";
  fbclidInput = document.querySelector("[name='adwords[fbclid]']");
  fbclidInput.setAttribute("value", fbclidValue);
}

var intervalId = window.setTimeout(function () {
  try {
    const tracker = ga.getAll()[0];
    analyticsId = tracker.get("clientId");
    return analyticsId;
  } catch (err) {}
}, 2000);

let trialStepOneEmailInputs = document.querySelectorAll("[app='create_trial_step1'] [app='email']");
emailInput = document.querySelector("[app='email']");
let trialOpenButton = document.querySelectorAll("[app='open_trial_modal_button']");
let trialStepOneModal = document.querySelector("[app='create_trial_step1_modal']");

// beforeunload
// formAbandon
let inputVals;
let inputValsArr = [];
let inputValsArrFiltered;
let elementId;
let result;

window.addEventListener("beforeunload", () => {
  trialStepOneEmailInputs.forEach((n) => {
    inputVals = n.value;
    let element = document.querySelector("[app='create_trial_step1']");
    elementId = element.getAttribute("app");
    inputValsArr.push(inputVals);
    inputValsArrFiltered = inputValsArr.filter((el) => el.length > 1);
  });

  if (inputValsArrFiltered.length > 0 && window.dataLayer) {
    data = {
      event: "formAbandon",
      formId: elementId,
      eventHistory: window.history,
    };

    dataLayer.push(data);
  }
});

trialOpenButton.forEach((n) => {
  n.addEventListener("click", () => {
    trialStepOneModal.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
});

trialStepOneEmailInputs.forEach((n) => {
  n.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.blur();
      const submitTrigger = this.form.querySelector("[app='submit-step-one']");
      submitTrigger.click();
    }
  });
  // Control Blur Step One
  n.addEventListener("blur", function () {
    checkEmailBlurTrialStepOne(n);

    let data;
    let element = document.querySelector("[app='create_trial_step1']");

    let elementId = element.getAttribute("app");

    if (window.dataLayer) {
      data = {
        event: "controlBlur",
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
  // Control Focus Step One
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[app='create_trial_step1']");
    let elementId = element.getAttribute("app");

    if (window.dataLayer) {
      data = {
        event: "controlFocus",
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
});

let createTrialStepOne = document.querySelectorAll("[app='submit-step-one']");

createTrialStepOne.forEach((el) => {
  el.addEventListener("click", (e) => {
    // e.preventDefault();
    // e.stopPropagation();
    let form = e.target.form;

    loader = el.querySelector(".loading-in-button");

    if (result) {
      loader.style.display = "block";
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step1",
          email: emailValue,
          analytics_id: analyticsId,
          "adwords[gclid]": gclidInput.value,
          "adwords[fbclid]": fbclidInput.value,
        },
        success: function (data) {
          const client_id = data.client_id;
          form = el.closest("form");
          let errorInfo = form.parentElement.querySelector(".w-form-fail");
          const errorMessages = {
            3: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj kilka minut, zanim zrobisz to ponownie.",
            2: "Próbujesz uruchomić więcej niż jedną wersję testową sklepu w zbyt krótkim czasie. Odczekaj co najmniej godzinę, zanim zrobisz to ponownie.",
            4: "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.",
          };
          if (errorMessages[data.code]) {
            errorInfo.children[0].innerHTML = errorMessages[data.code];
            errorInfo.style.display = "block";
            loader.style.display = "none";
          } else if (data.code === 1 || data.status === 1) {
            form = el.closest("form");
            trialStepOneModal.classList.remove("modal--open");
            const trialDomain = document.querySelector("[app='trial-domain']");
            trialDomain.innerHTML = data.host;
            document.querySelector("[modal='create_trial_step2']").classList.add("modal--open");
            loader.style.display = "none";
            $(document.body).css("overflow", "hidden");

            dataLayer.push({
              event: "trial_EmailSubmitted",
              client_id,
              "shop-id": data.shop_id,
              formId: form.parentElement.getAttribute("app"),
              email: emailValue,
            });

            dataLayer.push({
              eventName: "formSubmitSuccess",
              formId: form.parentElement.getAttribute("app"),
              eventCategory: "Button form sent",
              eventLabel: window.location.pathname,
              eventType: emailValue,
              eventHistory: window.history,
            });

            dataLayer.push({
              event: "myTrackEvent",
              formId: form.parentElement.getAttribute("app"),
              eventCategory: "Button form sent",
              eventAction: form.querySelector("[app='submit-step-one']").textContent,
              eventType: emailValue,
              eventLabel: window.location.pathname,
            });
          } else {
            dataLayer.push({
              eventName: "formSubmitError",
              formId: form.parentElement.getAttribute("app"),
              eventCategory: "Button form error",
              eventAction: form.querySelector("[app='submit-step-one']").textContent,
              eventLabel: window.location.pathname,
              eventType: emailValue,
              eventHistory: window.history,
            });

            dataLayer.push({
              event: "myTrackEvent",
              formId: form.parentElement.getAttribute("app"),
              eventCategory: "Button form error",
              eventAction: form.querySelector("[app='submit-step-one']").textContent,
              eventType: emailValue,
              eventLabel: window.location.pathname,
            });
          }
        },
      });
    } else {
    }
  });
});

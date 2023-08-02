const gclidInput = document.querySelector("[name='adwords[gclid]']");
const fbclidInput = document.querySelector("[name='adwords[fbclid]']");
const analyticsIdInputValue = document.querySelector("[name='analitycs_id']");
const trialStepOneEmailInputs = document.querySelectorAll("[app='create_trial_step1'] [app='email']");
emailInput = document.querySelector("[app='email']");
const trialOpenButton = document.querySelectorAll("[app='open_trial_modal_button']");
const trialStepOneModal = document.querySelector("[app='create_trial_step1_modal']");
let client_id;
let loader;
let elementId;
let result;
let analyticsId = "";

let inputVals;
let inputValsArr = [];
let inputValsArrFiltered;

// gclid
const urlSearchParams = new URLSearchParams(window.location.search);
let gclidValue = urlSearchParams.get("gclid") ?? "";

if (gclidInput) {
  gclidInput.setAttribute("value", gclidValue);
} else {
}

// fbclid
let fbclidValue = urlSearchParams.get("fbclid") ?? "";

if (fbclidInput) {
  fbclidInput.setAttribute("value", fbclidValue);
} else {
}

const intervalId = window.setTimeout(function () {
  try {
    const tracker = ga.getAll()[0];
    analyticsId = tracker.get("clientId");
    analyticsIdInputValue.value = analyticsId;
  } catch (err) {}
}, 2000);

// beforeunload
// formAbandon
const dataLayer = window.dataLayer || [];
const formAbandonHandler = () => {
  const inputValsArr = Array.from(trialStepOneEmailInputs)
    .map((n) => n.value)
    .filter((el) => el.length > 1);
  if (inputValsArr.length > 0) {
    const element = document.querySelector("[app='create_trial_step1']");
    const elementId = element.getAttribute("app");
    const data = {
      event: "formAbandon",
      formId: elementId,
      eventHistory: window.history,
    };
    dataLayer.push(data);
  }
};
window.addEventListener("beforeunload", formAbandonHandler);

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

    const element = document.querySelector("[app='create_trial_step1']");
    const elementId = element.getAttribute("app");
    const data = {
      event: "controlBlur",
      formId: elementId,
      controlName: n.getAttribute("app"),
      controlType: n.type,
      controlValue: n.value,
    };
    dataLayer.push(data);
  });
  // Control Focus Step One
  n.addEventListener("focus", () => {
    const element = document.querySelector("[app='create_trial_step1']");
    const elementId = element.getAttribute("app");
    const data = {
      event: "controlFocus",
      formId: elementId,
      controlName: n.getAttribute("app"),
      controlType: n.type,
      controlValue: n.value,
    };
    dataLayer.push(data);
  });
});

const createTrialStepOne = document.querySelectorAll("[app='submit-step-one']");

const handleFormSubmitSuccess = (data, form, client_id) => {
  const errorInfo = form.parentElement.querySelector(".w-form-fail");
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
};

createTrialStepOne.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const form = el.closest("form");
    loader = el.querySelector(".loading-in-button");

    if (result) {
      loader.style.display = "block";
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        xhrFields: {
          withCredentials: true,
        },
        data: {
          action: "create_trial_step1",
          email: emailValue,
          analytics_id: analyticsIdInputValue.value,
          "adwords[gclid]": gclidValue,
          "adwords[fbclid]": fbclidValue,
        },
        success: function (data) {
          const client_id = data.client_id;
          handleFormSubmitSuccess(data, form, client_id);
        },
      });
    } else {
    }
  });
});

let analyticsId;
let analyticsIdInputValue = document.querySelector("[name='analitycs_id']");
let isFromBanner = false;

var intervalId = window.setTimeout(function () {
  try {
    const tracker = ga.getAll()[0];
    let analyticsId = tracker.get("clientId");
    return analyticsId;
  } catch (err) {}
}, 2000);

let trialStepOneEmailInputs = document.querySelectorAll(
  "[app='create_trial_step1'] [app='email']"
);
emailInput = document.querySelector("[app='email']");
let trialOpenButton = document.querySelectorAll(
  "[app='open_trial_modal_button']"
);
let trialStepOneModal = document.querySelector(
  "[app='create_trial_step1_modal']"
);

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
      //       console.log(dataLayer);
    }
  });
});

let createTrialStepOne = document.querySelectorAll("[app='submit-step-one']");

createTrialStepOne.forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let form = e.target.form;
    // let emailInput = form.querySelector("[app='email']");
    // let emailValue = emailInput.value;

    if (result) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step1",
          email: emailValue,
          analytics_id: analyticsId,
        },
        success: function (data) {
          if (data.code === 2 || data.code === 3) {
            let errorInfo = form.parentElement.querySelector(".w-form-fail");
            errorInfo.children[0].innerHTML =
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.";
            errorInfo.style.display = "block";
          } else if (data.code === 1 || data.status === 1) {
            trialStepOneModal.classList.remove("modal--open");
            let trialDomain = document.querySelector("[app='trial-domain']");
            trialDomain.innerHTML = data.host;
            document
              .querySelector("[modal='create_trial_step2']")
              .classList.add("modal--open");
            $(document.body).css("overflow", "hidden");
            if (window.dataLayer) {
              data = {
                event: "trial_EmailSubmitted",
                "shop-id": data.shop_id,
                formId: e.target.form.id,
                email: emailValue,
              };

              dataLayer.push(data);

              data = {
                eventName: "formSubmitSuccess",
                formId: e.target.form.id,
                eventCategory: "Button form sent",
                eventLabel: window.location.pathname,
                eventType: emailValue,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: e.target.form.id,
                eventCategory: "Button form sent",
                eventAction: e.target.form.querySelector("input[type='submit']")
                  .value,
                eventType: emailValue,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //       console.log(dataLayer);
            }
          } else {
            // MyTrackEvent Error (Step One)
            if (window.dataLayer) {
              data = {
                eventName: "formSubmitError",
                formId: e.target.form.id,
                eventCategory: "Button form error",
                // eventAction: n.querySelector("input[type='submit']:nth-child(1)").value,
                eventAction: e.target.form.querySelector("input[type='submit']")
                  .value,
                eventLabel: window.location.pathname,
                eventType: emailValue,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: e.target.form.id,
                eventCategory: "Button form error",
                eventAction: e.target.form.querySelector("input[type='submit']")
                  .value,
                eventType: emailValue,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //             console.log(dataLayer);
            }
          }
        },
      });
    } else {
    }
  });
});

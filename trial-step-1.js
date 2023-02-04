// const myTimeout = setTimeout(ga, 4000);
let analyticsId;
let analyticsIdInputValue = document.querySelector("[name='analitycs_id']");
let isFromBanner = false;

// var intervalId = window.setTimeout(function () {
//   ga(function (tracker) {
//     analyticsId = tracker.get("clientId");
//     analyticsIdInputValue.value = analyticsId;
//     console.log(analyticsId);
//     return analyticsIdInputValue;
//   });
// }, 2000);

var intervalId = window.setTimeout(function () {
  try {
    const tracker = ga.getAll()[0];
    let analyticsId = tracker.get("clientId");
    analyticsIdInputValue.value = analyticsId;
    // console.log(analyticsId);
    return analyticsIdInputValue;
  } catch (err) {}
}, 5000);

// window.addEventListener("load", () => {
//   try {
//     let bannerD = document.querySelector("#w-slider-mask-1");
//     let blackFridaySlide = bannerD.children[2];
//     blackFridaySlide.id = "blackFridayData";

//     let descendants = blackFridaySlide.querySelectorAll("*");

//     descendants.forEach((n) => {
//       n.id = "blackFridayData";
//       n.addEventListener("click", () => {
//         isFromBanner = true;
//       });
//     });
//   } catch (err) {}
// });

let inputsStepOne = document.querySelectorAll(
  "[app='create_trial_step1'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])"
);

let trialOpen = document.querySelectorAll("[app='open_trial_modal_button']");

let modal = document.querySelector("[app='create_trial_step1_modal']");

// beforeunload
// formAbandon
let inputVals;
let inputValsArr = [];
let inputValsArrFiltered;
let elementId;

window.addEventListener("beforeunload", () => {
  inputsStepOne.forEach((n) => {
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

trialOpen.forEach((n) => {
  n.addEventListener("click", () => {
    modal.classList.add("modal--open");
    $(document.body).css("overflow", "hidden");
  });
});

inputsStepOne.forEach((n) => {
  // Control Blur Step One
  n.addEventListener("blur", () => {
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

createTrialStepOne.forEach((n) => {
  n.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let form = e.target.form;
    let emailInput = form.querySelector("[app='email']");
    let emailValue = emailInput.value;

    useRegexEmail(emailValue);
    checkEmail(e);

    if (useRegexEmail(emailValue)) {
      // let url = "https://www.shoper.pl/ajax.php";

      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step1",
          email: emailValue,
          analytics_id: analyticsIdInputValue.value,
        },
        success: function (data) {
          //           console.log(data);
          if (data.code === 2) {
            let errorInfo = form.parentElement.querySelector(".w-form-fail");
            errorInfo.children[0].innerHTML =
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie.";
            errorInfo.style.display = "block";
          } else if (data.code === 1 || data.status === 1) {
            modal.classList.remove("modal--open");
            // let errorInfo = form.parentElement.querySelector(".w-form-fail");
            let trialDomain = document.querySelector("[app='trial-domain']");
            trialDomain.innerHTML = data.host;
            // errorInfo.style.display = "none";
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

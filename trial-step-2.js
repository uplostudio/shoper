let gclidInput, gclidValue, fbclidInput, fbclidValue;

// gclid
try {
  let regexp = /\?gclid=.*\w/gm;
  let locationG = window.location.search;
  let match = locationG.match(regexp);

  if (match !== null) {
    let splited = match[0].split("=");
    if (splited[0] !== "") {
      gclidValue = splited[1].slice(0, -1);
      localStorage.setItem("gclid", gclidValue);
      // console.log(gclidValue)
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

  let regexpFb = /\?fbclid=.*\w/gm;
  let locationGFb = window.location.search;
  let matchFb = locationGFb.match(regexpFb);

  if (matchFb !== null) {
    let splited = matchFb[0].split("=");
    if (splited[0] !== "") {
      fbclidValue = splited[1].slice(0, -1);
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
} catch (err) {}
// console.log(gclidInput)
// console.log(localStorage.gclid)

let inputsStepTwo = document.querySelectorAll(
  "[app='create_trial_step2'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])"
);
// formAbandon
window.addEventListener("beforeunload", () => {
  inputsStepTwo.forEach((n) => {
    inputVals = n.value;
    let element = document.querySelector("[app='create_trial_step2']");
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
    //       console.log(dataLayer);
  }
});

inputsStepTwo.forEach((n) => {
  // Control Blur Step Two
  n.addEventListener("blur", function () {
    checkPhoneBlurTrialStepTwo(n);
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.id;

    if (window.dataLayer) {
      data = {
        event: "controlBlur",
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
    }
  });
  // Control Focus Step Two
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.getAttribute("data-name");

    if (window.dataLayer) {
      data = {
        event: "controlFocus",
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value,
      };

      dataLayer.push(data);
      //       console.log(dataLayer);
    }
  });
});

let createTrialStepTwo = document.querySelectorAll(
  "[app='create_trial_step2']"
);

// On submit actions start here

createTrialStepTwo.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // let url = "https://www.shoper.pl/ajax.php";
    if (result) {
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step2",
          phone: n.querySelector("[app='phone']").value,
          eventName: "formSubmitSuccess",
          formId: n.querySelector("form").id,
          gclid: gclidInput.value,
          fbclid: fbclidInput.value,
          blackFridayBanner: isFromBanner,
          analytics_id: analyticsId,
        },
        success: function (data) {
          if (data.status === 1) {
            // MyTrackEvent Success (Step Two)
            let errorInfo = n.querySelector(".w-form-fail");

            errorInfo.style.display = "none";
            if (window.dataLayer) {
              data = {
                event: "formSubmitSuccess",
                eventCategory: "Button modal form sent",
                formId: n.querySelector("form").id,
                "shop-id": data.license_id,
                eventAction: n.querySelector("input[type='submit']").value,
                eventLabel: window.location.pathname,
                eventType: n.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form sent",
                eventAction: n.querySelector("input[type='submit']").value,
                eventType: n.querySelector("input[type='tel']").value,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //             console.log(dataLayer);
            }
            window.location.href = "https://www.shoper.pl/zaloz-sklep/";
          } else {
            //            console.log(data);
            let errorInfo = n.querySelector(".w-form-fail");
            errorInfo.children[0].innerHTML =
              "Coś poszło nie tak. Spróbuj ponownie.";
            errorInfo.style.display = "block";
            // MyTrackEvent Error (Step Two)
            if (window.dataLayer) {
              data = {
                event: "formSubmitError",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form error",
                eventAction: n.querySelector("input[type='submit']").value,
                eventLabel: window.location.pathname,
                eventType: n.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: n.querySelector("form").id,
                eventCategory: "Button modal form error",
                eventAction: n.querySelector("input[type='submit']").value,
                eventType: n.querySelector("input[type='tel']").value,
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

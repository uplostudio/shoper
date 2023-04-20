let inputsStepTwo = document.querySelectorAll("[app='create_trial_step2'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])");
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
    }
  });
});

let createTrialStepTwo = document.querySelectorAll("[app='create_trial_step2']");

// On submit actions start here

createTrialStepTwo.forEach((n) => {
  n.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let form = n.closest("form");
    let formParent = form.parentElement;

    loader = form.querySelector(".loading-in-button");

    if (result) {
      loader.style.display = "block";
      $.ajax({
        url: "https://www.shoper.pl/ajax.php",
        headers: {},
        method: "POST",
        data: {
          action: "create_trial_step2",
          phone: form.querySelector("[app='phone']").value,
          eventName: "formSubmitSuccess",
          formId: form.id,
          "adwords[gclid]": gclidInput.value,
          "adwords[fbclid]": fbclidInput.value,
          blackFridayBanner: isFromBanner,
          analytics_id: analyticsId,
        },
        success: function (data) {
          if (data.status === 1) {
            // MyTrackEvent Success (Step Two)
            let errorInfo = e.target.closest(".w-form-fail");
            errorInfo.style.display = "none";
            loader.style.display = "none";
            if (window.dataLayer) {
              data = {
                event: "formSubmitSuccess",
                eventCategory: "Button modal form sent",
                client_id: client_id,
                formId: form.id,
                "shop-id": data.license_id,
                eventAction: n.textContent,
                eventLabel: window.location.pathname,
                eventType: form.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: form.id,
                eventCategory: "Button modal form sent",
                eventAction: n.textContent,
                eventType: form.querySelector("input[type='tel']").value,
                eventLabel: window.location.pathname,
              };

              dataLayer.push(data);
              //             console.log(dataLayer);
            }
            window.location.href = "https://www.shoper.pl/zaloz-sklep/";
          } else {
            //            console.log(data);
            let errorInfo = formParent.querySelector(".w-form-fail");
            errorInfo.children[0].innerHTML = "Coś poszło nie tak. Spróbuj ponownie.";
            errorInfo.style.display = "block";
            loader.style.display = "none";
            // MyTrackEvent Error (Step Two)
            if (window.dataLayer) {
              data = {
                event: "formSubmitError",
                formId: form.id,
                eventCategory: "Button modal form error",
                eventAction: n.textContent,
                eventLabel: window.location.pathname,
                eventType: form.querySelector("input[type='tel']").value,
                eventHistory: window.history,
              };

              dataLayer.push(data);

              data = {
                event: "myTrackEvent",
                formId: form.id,
                eventCategory: "Button modal form error",
                eventAction: n.textContent,
                eventType: form.querySelector("input[type='tel']").value,
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

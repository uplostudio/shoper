let inputsStepOne = document.querySelectorAll("[app='create_trial_step1'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])")

   let trialOpen = document.querySelectorAll("[app='open_trial_modal_button']");


console.log(trialOpen)

  trialOpen.forEach((n) => {
    n.addEventListener("click", () => {
        document.querySelector("[app='create_trial_step1_modal']").classList.add("modal--open");
      })
  })

inputsStepOne.forEach((n) => {
  // Control Blur Step One
  n.addEventListener("blur", () => {
    let data;
    let element = document.querySelector("[app='create_trial_step1']");
    console.log(element)
    let elementId = element.getAttribute("app");
    console.log(elementId);

    if (window.dataLayer) {
      data = {
        event: 'controlBlur',
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }
  })
  // Control Focus Step One
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[app='create_trial_step1']");
    let elementId = element.getAttribute("app");

    if (window.dataLayer) {
      data = {
        event: 'controlFocus',
        formId: elementId,
        controlName: n.getAttribute("app"),
        controlType: n.type,
        controlValue: n.value
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }
  })
})


let createTrialStepOne = document.querySelectorAll(
  "[app='create_trial_step1']"
);

console.log(createTrialStepOne)

createTrialStepOne.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // let url = "https://www.shoper.pl/ajax.php";

   $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "create_trial_step1",
      email: n.querySelector("[app='email']").value
    },
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
let errorInfo = n.querySelector(".w-form-fail");
          errorInfo.children[0].innerHTML = "Podany email jest nieprawidłowy";
          errorInfo.style.display = "none";
  // document.querySelector("[app='create_trial_step1_modal']")
  //         .classList.remove("modal--open");
        document
          .querySelector("[modal='create_trial_step2']")
          .classList.add("modal--open");
 if (window.dataLayer) {
          data = {
            eventCategory: "Button form sent",
            eventName: "formSubmitSuccess",
            formId: n.querySelector("form").id,
            // eventTime = this.getFormTime(),
            eventAction: n.querySelector("input[type='submit']:nth-child(1)")
              .value,
            eventLabel: window.location.pathname,
            eventType: n.querySelector("[app='email']").value,
          };

          dataLayer.push(data);
          console.log(dataLayer);
        }
      } else {
        
         // MyTrackEvent Error (Step One)
        if (window.dataLayer) {
          data = {
            eventCategory: "Button form error",
             eventName: "formSubmitError",
            formId: n.querySelector("form").id,
            eventAction: n.querySelector("input[type='submit']:nth-child(1)")
              .value,
            eventLabel: window.location.pathname,
            eventType: n.querySelector("[app='email']").value,
          };

          dataLayer.push(data);
          console.log(dataLayer);
        }
          let errorInfo = n.querySelector(".w-form-fail");
          errorInfo.children[0].innerHTML = "Podany email jest nieprawidłowy";
          errorInfo.style.display = "block";
        if (data.code === 2) {
          errorInfo.html(
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie."
            );
        }
      }
    }
  });
  });
});










// $(".is-trial-popup, [app='open_trial_modal_button']").on("click", function () {
//   $("[app='create_trial_step1_modal']").addClass("modal--open");
// });

// $("[app='create_trial_step1']").on("submit", function (event) {
//   event.preventDefault();
//   event.stopPropagation();
//   const errorInfo = $(this).find(".w-form-fail");
//   $.ajax({
//     url: "https://www.shoper.pl/ajax.php",
//     headers: {},
//     method: "POST",
//     data: {
//       action: "create_trial_step1",
//       email: $(this).find("[app='email']").val()
//     },
//     success: function (data) {
//       console.log(data);
//       if (data.status === 1) {
//         $("[app='create_trial_step1_modal']").removeClass("modal--open");
//         $("[modal='create_trial_step2']").addClass("modal--open");
//         $("[app='trial-domain']").html(data.host);
//       } else {
//         errorInfo.css("display", "block");
//         errorInfo.html("Podany email jest nieprawidłowy");
//         if (data.code === 2) {
//           errorInfo.html(
//               "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie."
//             );
//         }
//       }
//     }
//   });
// });

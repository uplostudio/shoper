// let inputsStepOne = document.querySelectorAll("[app='create_trial_step1'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])")


// inputsStepOne.forEach((n) => {
//   // Control Blur Step One
//   n.addEventListener("blur", () => {
//     let data;
//     let element = document.querySelector("[data-name='create_trial_step1']");
//     let elementId = element.id;

//     if (window.dataLayer) {
//       data = {
//         event: 'controlBlur',
//         formId: elementId,
//         controlName: n.getAttribute("data-name"),
//         controlType: n.type,
//         controlValue: n.value
//       };

//       dataLayer.push(data);
//       console.log(dataLayer);
//     }
//   })
//   // Control Focus Step One
//   n.addEventListener("focus", () => {
//     let data;
//     let element = document.querySelector("[data-name='create_trial_step1']");
//     let elementId = element.id;

//     if (window.dataLayer) {
//       data = {
//         event: 'controlFocus',
//         formId: elementId,
//         controlName: n.getAttribute("data-name"),
//         controlType: n.type,
//         controlValue: n.value
//       };

//       dataLayer.push(data);
//       console.log(dataLayer);
//     }
//   })
// })


// let createTrialStepOne = document.querySelectorAll(
//   "[app='create_trial_step1']"
// );


// createTrialStepOne.forEach((n) => {
//   n.addEventListener("submit", (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     let url = "https://www.shoper.pl/ajax.php";

//     fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify({
//         action: "create_trial_step1",
//         email: n.querySelector("[app='email']").value,
//       }),
//     }).then((response) => {
//       let status = response.status;


//       if (status === 200) {
//         document
//           .querySelector("[app='create_trial_step1_modal']")
//           .classList.remove("modal--open");
//         document
//           .querySelector("[modal='create_trial_step2']")
//           .classList.add("modal--open");
//         // $("[app='trial-domain']").html(data.host);
//         // MyTrackEvent Success (Step One)
//         if (window.dataLayer) {
//           data = {
//             eventCategory: "Button form sent",
//             eventAction: n.querySelector("input[type='submit']:nth-child(1)")
//               .value,
//             eventLabel: window.location.pathname,
//             eventType: n.querySelector("[app='email']").value,
//           };

//           dataLayer.push(data);
//           console.log(dataLayer);
//         }
//       } else {
//         errorInfo.css("display", "block");
//         errorInfo.html("Podany email jest nieprawidłowy");
//         // MyTrackEvent Error (Step One)
//         if (window.dataLayer) {
//           data = {
//             eventCategory: "Button form error",
//             eventAction: n.querySelector("input[type='submit']:nth-child(1)")
//               .value,
//             eventLabel: window.location.pathname,
//             eventType: n.querySelector("[app='email']").value,
//           };

//           dataLayer.push(data);
//           console.log(dataLayer);
//         }
//       }
//     });
//   });
// });



$(".is-trial-popup, [app='open_trial_modal_button']").on("click", function () {
  $("[app='create_trial_step1_modal']").addClass("modal--open");
});

$("[app='create_trial_step1']").on("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  const errorInfo = $(this).find(".w-form-fail");
  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "create_trial_step1",
      email: $(this).find("[app='email']").val()
    },
    success: function (data) {
      console.log(data);
      if (data.status === 1) {
        $("[app='create_trial_step1_modal']").removeClass("modal--open");
        $("[modal='create_trial_step2']").addClass("modal--open");
        $("[app='trial-domain']").html(data.host);
      } else {
        errorInfo.css("display", "block");
        errorInfo.html("Podany email jest nieprawidłowy");
        if (data.code === 2) {
          errorInfo.html(
              "Uruchomiłeś co najmniej cztery wersje testowe sklepu w zbyt krótkim czasie. Odczekaj 24h od ostatniej udanej próby, zanim zrobisz to ponownie."
            );
        }
      }
    }
  });
});

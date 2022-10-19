let inputsStepTwo = document.querySelectorAll("[app='create_trial_step2'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])")


inputsStepTwo.forEach((n) => {
  // Control Blur Step Two
  n.addEventListener("blur", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.id;

    if (window.dataLayer) {
      data = {
        event: 'controlBlur',
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }
  })
  // Control Focus Step Two
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step2']");
    let elementId = element.id;

    if (window.dataLayer) {
      data = {
        event: 'controlFocus',
        formId: elementId,
        controlName: n.getAttribute("data-name"),
        controlType: n.type,
        controlValue: n.value
      };

      dataLayer.push(data);
      console.log(dataLayer);
    }
  })
})

let createTrialStepTwo = document.querySelectorAll(
  "[app='create_trial_step2']"
);


createTrialStepTwo.forEach((n) => {
  n.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    let url = "https://www.shoper.pl/ajax.php";

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        action: "create_trial_step2",
        phone: n.querySelector("[app='phone']").value,
      }),
    }).then((response) => {
      let status = response.status;


      if (status === 200) {
        // MyTrackEvent Success (Step Two)
        if (window.dataLayer) {
          data = {
            eventCategory: "Button form sent",
            eventAction: n.querySelector("input[type='submit']").value,
            eventLabel: window.location.pathname,
            eventType: n.querySelector("input[type='tel']").value,
          };

          dataLayer.push(data);
          console.log(dataLayer);
        }
      } else {
        errorInfo.css("display", "block");
        errorInfo.html("Podany email jest nieprawidłowy");
        // MyTrackEvent Error (Step Two)
        if (window.dataLayer) {
          data = {
            eventCategory: "Button form error",
            eventAction: n.querySelector("input[type='submit']").value,
            eventLabel: window.location.pathname,
            eventType: n.querySelector("input[type='tel']").value,
          };

          dataLayer.push(data);
          console.log(dataLayer);
        }
      }
    });
  });
});




// $("[app='create_trial_step2']").on("submit", function (event) {
//   event.preventDefault();
//   event.stopPropagation();
//   const errorInfo = $(this).find(".w-form-fail");
//   $.ajax({
//     url: "https://www.shoper.pl/ajax.php",
//     headers: {},
//     method: "POST",
//     data: {
//       action: "create_trial_step2",
//       phone: $(this).find("[app='phone']").val(),
//     },
//     success: function (data) {
//       console.log(data);
//       if (data.status === 1) {
//         window.location.href = "https://www.shoper.pl/zaloz-sklep/";
//       } else {
//         errorInfo.css("display", "block");
//         errorInfo.html("Podany numer jest nieprawidłowy");
//       }
//     }
//   });
// });

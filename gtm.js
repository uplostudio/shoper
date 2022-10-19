window.dataLayer = window.dataLayer || [];

let inputsStepOne = document.querySelectorAll("[app='create_trial_step1'] input:not([type='radio']):not([type='checkbox']):not([type='password']):not([type='submit'])")


inputsStepOne.forEach((n) => {
  // Control Blur Step One
  n.addEventListener("blur", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step1']");
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
      console.log(dataLayer)
    }
  })
  // Control Focus Step One
  n.addEventListener("focus", () => {
    let data;
    let element = document.querySelector("[data-name='create_trial_step1']");
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

let bruttoForm = document.querySelector("#wf-form-Brutto-Form");

var slider = document.getElementById("brutto_slider");
let amountValue = 0;

console.log(amountValue);

noUiSlider.create(slider, {
  start: [0],
  connect: true,
  range: {
    min: 0,
    max: 100000,
  },
});

var stepSliderValueElement = document.getElementById("slider-step-value");

slider.noUiSlider.on("update", function (values, handle) {
  stepSliderValueElement.innerHTML = values[handle];
  amountValue = values[handle];
});

bruttoForm.addEventListener("change", () => {
  let installmentPeriod = document.querySelector(
    'input[name="installment_amount"]:checked'
  ).value;
  console.log(installmentPeriod);
  console.log(amountValue);

  fetch(
    `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
    {
      headers: {
        Accept: "*/*",
      },
      method: "GET",
    }
  ).then(function (response) {
    console.log(response);
  });
});

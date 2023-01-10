let bruttoForm = document.querySelector("#wf-form-Brutto-Form");
var slider = document.getElementById("brutto_slider");
let totalCost = document.querySelector("[app='total_cost']");
let repaymentAmmount = document.querySelector("[app='repayment_amount']");
let monthlyCost = document.querySelector("[app='monthly_cost']");
let rrso = document.querySelector("[app='annual_percentage_rate_of_charge']");
let installmentRadios = document.querySelectorAll(
  "input[name='installment_amount']"
);
let amountValue = 1;
installmentRadios[0].checked = true;

noUiSlider.create(slider, {
  start: [1],
  connect: true,
  format: {
    to: (v) => v | 0,
    from: (v) => v | 0,
  },
  range: {
    min: 0,
    max: 100000,
  },
});

var stepSliderValueElement = document.getElementById("slider-step-value");

slider.noUiSlider.on("update", function (values, handle) {
  stepSliderValueElement.innerHTML = values[handle];
});

var stepSliderValueElement = document.getElementById("slider-step-value");

slider.noUiSlider.on("update", function (values, handle) {
  stepSliderValueElement.innerHTML = `${values[handle]} zł`;
  amountValue = values[handle];
  fetch(
    `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
    {
      headers: {
        Accept: "*/*",
      },
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let obj = data.purchase_simulation.results;
      let picked = Object.fromEntries(
        Object.entries(obj).filter(([key]) => key.includes(`3`))
      );
      let pickedByPeriod = picked[3];

      totalCost.innerHTML = `${pickedByPeriod.total_cost} zł`;
      repaymentAmmount.innerHTML = `${pickedByPeriod.repayment_amount} zł`;
      monthlyCost.innerHTML = `${pickedByPeriod.monthly_cost} zł`;
      rrso.innerHTML = `${pickedByPeriod.annual_percentage_rate_of_charge} %`;
    });
});

bruttoForm.addEventListener("change", () => {
  let installmentPeriod = document.querySelector(
    'input[name="installment_amount"]:checked'
  ).value;
  fetch(
    `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
    {
      headers: {
        Accept: "*/*",
      },
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let obj = data.purchase_simulation.results;
      let picked = Object.fromEntries(
        Object.entries(obj).filter(([key]) =>
          key.includes(`${installmentPeriod}`)
        )
      );
      let pickedByPeriod = picked[installmentPeriod];

      totalCost.innerHTML = `${pickedByPeriod.total_cost} zł`;
      repaymentAmmount.innerHTML = `${pickedByPeriod.repayment_amount} zł`;
      monthlyCost.innerHTML = `${pickedByPeriod.monthly_cost} zł`;
      rrso.innerHTML = `${pickedByPeriod.annual_percentage_rate_of_charge} %`;
    });
});

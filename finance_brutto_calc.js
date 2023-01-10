let bruttoForm = document.querySelector("#wf-form-Brutto-Form");
var slider = document.getElementById("brutto_slider");
let amountValue = 1;
let totalCost = document.querySelector("[app='total_cost']");
let repaymentAmmount = document.querySelector("[app='repayment_amount']");
let monthlyCost = document.querySelector("[app='monthly_cost']");
let rrso = document.querySelector("[app='annual_percentage_rate_of_charge']");

noUiSlider.create(slider, {
  start: [1],
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
  // console.log(installmentPeriod);
  // console.log(amountValue);

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
      // console.log(installmentPeriod)
      // console.log(data.purchase_simulation.results)
      console.log(picked);
      // totalCost.innerHTML = picked.total_cost;
      // repaymentAmmount.innerHTML = picked.repayment_amount;
      // monthlyCost.innerHTML = picked.monthly_cost;
      // rrso.innerHTML = picked.annual_percentage_rate_of_charge;
    });
});

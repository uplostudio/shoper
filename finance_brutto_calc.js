let bruttoForm = document.querySelector("#wf-form-brutto-form");
var slider = document.getElementById("brutto_slider");
let totalCost = document.querySelector("[app='total_cost']");
let repaymentAmmount = document.querySelector("[app='repayment_amount']");
let monthlyCost = document.querySelector("[app='monthly_cost']");
let rrso = document.querySelector("[app='annual_percentage_rate_of_charge']");
let installmentRadios = document.querySelectorAll(
  "input[name='installment_amount']"
);
let manualInput = document.querySelector("input[name='manual-input']");
let amountValue = 5000;
// let manualInputValue = amountValue;
installmentRadios[0].checked = true;

noUiSlider.create(slider, {
  start: [5000],
  connect: true,
  step: 500,
  format: {
    to: (v) => v | 0,
    from: (v) => v | 0,
  },
  range: {
    min: 5000,
    max: 10000,
  },
});

var stepSliderValueElement = document.getElementById("slider-step-value");

slider.noUiSlider.on("update", function (values, handle) {
  stepSliderValueElement.innerHTML = values[handle];
  manualInput.value = values[handle];
  // console.log(manualInput.value)
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

      let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
      let roundedRepaymentAmount = Math.round(pickedByPeriod.repayment_amount);
      let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
      let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

      totalCost.innerHTML = `${roundedTotalCost} zł`;
      repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
      monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
      rrso.innerHTML = `${rrsoVal} %`;
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

      let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
      let roundedRepaymentAmount = Math.round(pickedByPeriod.repayment_amount);
      let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
      let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

      totalCost.innerHTML = `${roundedTotalCost} zł`;
      repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
      monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
      rrso.innerHTML = `${rrsoVal} %`;
    });
});

manualInput.addEventListener("change", (e) => {
  if (manualInput.value < 5000) {
    manualInput.value = 5000;
  } else {
  }
  slider.noUiSlider.set(manualInput.value);
  stepSliderValueElement.innerHTML = `${manualInput.value} zł`;

  let installmentPeriod = document.querySelector(
    'input[name="installment_amount"]:checked'
  ).value;
  try {
    fetch(
      `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${manualInput.value}`,
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

        let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
        let roundedRepaymentAmount = Math.round(
          pickedByPeriod.repayment_amount
        );
        let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
        let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

        totalCost.innerHTML = `${roundedTotalCost} zł`;
        repaymentAmmount.innerHTML = `${roundedRepaymentAmount} zł`;
        monthlyCost.innerHTML = `${roundedMonthlyCost} zł`;
        rrso.innerHTML = `${rrsoVal} %`;
      });
  } catch (err) {}
});

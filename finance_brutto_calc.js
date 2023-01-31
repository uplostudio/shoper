window.addEventListener("load", () => {
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
  installmentRadios[4].checked = true;

  bruttoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

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
      max: 50000,
    },
  });

  let stepSliderValueElement = document.getElementById("slider-step-value");

  slider.noUiSlider.on("update", function (values, handle) {
    stepSliderValueElement.innerHTML = `${values[handle]} zł`;
    manualInput.value = values[handle];
    amountValue = values[handle];
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
        // console.log(data)
        let obj = data.purchase_simulation.results;
        let picked = Object.fromEntries(
          Object.entries(obj).filter(([key]) =>
            key.includes(`${installmentPeriod}`)
          )
        );
        let pickedByPeriod = picked[`${installmentPeriod}`];
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
  });

  bruttoForm.addEventListener("change", () => {
    try {
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
          let pickedByPeriod = picked[`${installmentPeriod}`];
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

  manualInput.addEventListener("change", (e) => {
    if (manualInput.value < 5000 || manualInput.value > 50000) {
      manualInput.nextElementSibling.style.display = "flex";
    } else {
      manualInput.nextElementSibling.style.display = "none";
    }
    slider.noUiSlider.set(manualInput.value);
    stepSliderValueElement.innerHTML = `${manualInput.value} zł`;
    try {
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
          let pickedByPeriod = picked[`${installmentPeriod}`];

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

  function checkLowest() {
    if (manualInput.value < 5000 || manualInput.value > 50000) {
      manualInput.nextElementSibling.style.display = "flex";
    } else {
      manualInput.nextElementSibling.style.display = "none";
    }
  }

  setInterval(checkLowest, 100);
});

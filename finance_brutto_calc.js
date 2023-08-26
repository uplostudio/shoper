$(document).ready(function () {
  let bruttoForm = $("#wf-form-brutto-form");
  let slider = $("#brutto_slider")[0];
  let totalCost = $("[app='total_cost']");
  let repaymentAmmount = $("[app='repayment_amount']");
  let monthlyCost = $("[app='monthly_cost']");
  let rrso = $("[app='annual_percentage_rate_of_charge']");
  let installmentRadios = $("input[name='installment_amount']");
  let manualInput = $("input[name='manual-input']");
  let amountValue = 5000;

  installmentRadios[4].checked = true;

  bruttoForm.on("submit", function (e) {
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

  let stepSliderValueElement = $("#slider-step-value");

  slider.noUiSlider.on("update", function (values, handle) {
    // Removed redundant steps since jQuery and fetch API supports promises by default
    updateValues(values[handle]);
  });

  bruttoForm.on("change", function () {
    // Removed redundant steps since jQuery and fetch API supports promises by default
    updateValues(amountValue);
  });

  manualInput.on("change", function (e) {
    if (manualInput.val() < 5000 || manualInput.val() > 50000) {
      manualInput.next().css("display", "flex");
    } else {
      manualInput.next().css("display", "none");
    }

    slider.noUiSlider.set(manualInput.val());
    stepSliderValueElement.html(`${manualInput.val()} zł`);

    // Removed redundant steps since jQuery and fetch API supports promises by default
    updateValues(manualInput.val());
  });

  function checkLowest() {
    if (manualInput.val() < 5000 || manualInput.val() > 50000) {
      manualInput.next().css("display", "flex");
    } else {
      manualInput.next().css("display", "none");
    }
  }

  setInterval(checkLowest, 100);

  // Function to Reduce Redundant HTTP request
  function updateValues(amount) {
    amountValue = amount;
    let installmentPeriod = $('input[name="installment_amount"]:checked').val();

    $.ajax({
      url: `https://www.brutto.pl/api/v3/simulation/purchase?partner=e8694f3a-45fe-5fa6-bb74-ccc1e8f16d32&currency=PLN&amount=${amountValue}`,
      headers: {
        Accept: "*/*",
      },
      method: "GET",
      success: function (data) {
        let obj = data.purchase_simulation.results;
        let picked = Object.fromEntries(Object.entries(obj).filter(([key]) => key.includes(`${installmentPeriod}`)));
        let pickedByPeriod = picked[`${installmentPeriod}`];
        let roundedTotalCost = Math.round(pickedByPeriod.total_cost);
        let roundedRepaymentAmount = Math.round(pickedByPeriod.repayment_amount);
        let roundedMonthlyCost = Math.round(pickedByPeriod.monthly_cost);
        let rrsoVal = pickedByPeriod.annual_percentage_rate_of_charge;

        totalCost.html(`${roundedTotalCost} zł`);
        repaymentAmmount.html(`${roundedRepaymentAmount} zł`);
        monthlyCost.html(`${roundedMonthlyCost} zł`);
        rrso.html(`${rrsoVal} %`);
      },
    });
  }
});

const toggleForm = $("[data-app='toggle-form']");
const toggleButton = toggleForm.find("[data-app='toggle-button']");
const toggleCheckbox = toggleForm.find("input[type='checkbox']");
const priceBox = $("[data-content='price-box']");
const buttonToggle = $("[data-app='button-toggle']");

function updateAnimation() {
  const transitionDuration = 200; // Transition duration in milliseconds

  if (toggleCheckbox.is(":checked")) {
    toggleButton.addClass("is-checked").css("transition-duration", `${transitionDuration}ms`);
    buttonToggle.addClass("is-checked").css("transition-duration", `${transitionDuration}ms`);
  } else {
    toggleButton.removeClass("is-checked").css("transition-duration", `${transitionDuration}ms`);
    buttonToggle.removeClass("is-checked").css("transition-duration", `${transitionDuration}ms`);
  }
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function updatePrices() {
  priceBox.each(function () {
    const priceElement = $(this).children().first();
    const labelElement = $(this).children().eq(1);

    const initialPrice = priceElement.text().trim();
    let price = initialPrice.replace(/\s/g, "").replace(",", ".");
    let label = labelElement ? labelElement.text().trim() : ""; // Check if labelElement exists

    if (toggleCheckbox.is(":checked")) {
      price = (parseFloat(price) * 1.23).toFixed(2).replace(".", ",");
      label = label.replace("netto", "brutto");
    } else {
      price = (parseFloat(price) / 1.23).toFixed(2).replace(".", ",");
      label = label.replace("brutto", "netto");
    }

    price = formatNumber(price); // Format the price
    priceElement.text(price);

    if (labelElement) {
      labelElement.text(label);
    }
  });
}

toggleButton.on("click", () => {
  toggleCheckbox.click();
  updatePrices();
  updateAnimation();
});

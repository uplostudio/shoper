const currency = {
  pl: "zł",
  en: "PLN",
};
// if user uses back/forward buttons

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.type === "back_forward") {
      location.reload(true);
    }
  });
});

observer.observe({ type: "navigation", buffered: true });
window.addEventListener("load", () => {
  $("[app='open_create_trial_step1_modal_button']").on("click", function () {
    $("[app='create_trial_step1_modal']").addClass("modal--open");
    $(document.body).css("overflow", "hidden");
  });
  $("[app='open_custom_modal_button']").on("click", function () {
    $("[app='bannerModal']").addClass("modal--open");
    let cardType = this.parentElement.getAttribute("card");
    this.parentElement.style.display = "grid";
    if (cardType === "enterprise") {
      document.querySelector("[app='custom_form']").setAttribute("package", "31");
      document.querySelector("[app='custom_form']").setAttribute("form", "enterprise-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
        console.log(dataLayer);
      }
    } else {
      document.querySelector("[app='custom_form']").setAttribute("package", "7");
      document.querySelector("[app='custom_form']").setAttribute("form", "premium-form");

      if (window.dataLayer) {
        data = {
          event: "myTrackEvent”",
          eventCategory: "Button modal opened",
          eventAction: this.textContent,
          eventLabel: window.location.href,
          eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
        };

        dataLayer.push(data);
      }
    }
    $(document.body).toggleClass("overflow-hidden", true);
  });

  // form + checkbox
  let toggleForm = document.querySelector("[app='toggle_form']");
  let togglePrice = document.querySelector("[app='toggle_button']");
  let checkboxPrice = toggleForm.querySelector("input[type='checkbox']");
  let toggleFormYear = document.querySelector("[app='yearly_form']");
  let toggleYear = document.querySelector("[app='yearlyToggle']");
  let checkboxYear = toggleFormYear.querySelector("input[type='checkbox']");
  // promo prices
  let priceBoxStandard = document.querySelector("[pricebox='standard']").children[0];
  let priceBoxPremium = document.querySelector("[pricebox='premium']").children[0];
  let priceBoxEnterprise = document.querySelector("[pricebox='enterprise']").children[0];
  // clones
  let priceBoxStandardClone = document.querySelector("[pricebox='standardClone']").children[0];
  let priceBoxPremiumClone = document.querySelector("[pricebox='premiumClone']").children[0];
  let priceBoxEnterpriseClone = document.querySelector("[pricebox='enterpriseClone']").children[0];
  // price boxes
  let boxStandard;
  let boxPremium;
  let boxEnterprise;
  // price boxes clones
  let boxStandardClone = document.querySelector("#box-standard-clone");
  let boxPremiumClone = document.querySelector("#box-premium-clone");
  let boxEnterpriseClone = document.querySelector("#box-enterprise-clone");
  // regular prices
  let priceBoxStandardRegular = document.querySelector("[regular='standard']");
  let priceBoxPremiumRegular = document.querySelector("[regular='premium']");
  let priceBoxEnterpriseRegular = document.querySelector("[regular='enterprise']");
  let priceBoxStandardRegularMini = document.querySelector("[regular='standard_mini']");
  let priceBoxPremiumRegularMini = document.querySelector("[regular='premium_mini']");
  let priceBoxEnterpriseRegularMini = document.querySelector("[regular='enterprise_mini']");

  // labels
  let boxLabelStandard = document.querySelector("[pricelabel='standard']");
  let boxLabelPremium = document.querySelector("[pricelabel='premium']");
  let boxLabelEnterprise = document.querySelector("[pricelabel='enterprise']");

  // badges
  let standardBadge = document.querySelector("[standard='badge']");
  let premiumBadge = document.querySelector("[premium='badge']");
  let enterpriseBadge = document.querySelector("[enterprise='badge']");

  // accordion first child
  let accordionFirstChild = document.querySelectorAll("[accordion='firstChild']");

  let net = {
    pl: "netto miesięcznie",
    en: "net monthly",
  };
  let gross = {
    pl: "brutto miesięcznie",
    en: "gross monthly",
  };

  //  grab form
  if (document.querySelector("[app='custom_form']")) {
    formWrapper = document.querySelector("[app='custom_form']");
    // grab form trigger
    formTrigger = formWrapper.querySelector("[app='bcm-submit']");
    // grab all input fields from form without checkboxes
    phoneInput = formWrapper.querySelector("[app='phone_campaign']");
    emailInput = formWrapper.querySelector("[app='email_campaign']");

    phoneInput.addEventListener("keydown", createEnterKeydownHandler(phoneInput, formTrigger));
    emailInput.addEventListener("keydown", createEnterKeydownHandler(emailInput, formTrigger));

    // Attach EventListeners to inputs

    emailInput.addEventListener("blur", function () {
      checkEmailBlur();
    });

    phoneInput.addEventListener("blur", function () {
      checkPhoneBlur();
    });

    formTrigger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      formWrapper = e.target.closest("form");
      loader = formWrapper.querySelector(".loading-in-button");

      checkEmailBlur();
      checkPhoneBlur();

      if (!checkEmailBlur() && window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "errorFormEvent",
          eventValue: "",
          eventLabel: "email",
        };

        dataLayer.push(data);
        // console.log(dataLayer);
      }

      if (!checkPhoneBlur() && window.dataLayer) {
        data = {
          event: "myTrackEvent",
          eventCategory: "errorFormEvent",
          eventValue: "",
          eventLabel: "phone",
        };

        dataLayer.push(data);
        // console.log(dataLayer);
      }

      // const body = new FormData();
      // body.append("action", formWrapper.parentElement.getAttribute("action"));
      // body.append("type", formWrapper.parentElement.getAttribute("type"));
      // body.append("source_id", formWrapper.parentElement.getAttribute("source_id"));
      // body.append("package", formWrapper.parentElement.getAttribute("package"));
      // body.append("email", phoneInputValue);
      // body.append("phone", emailValue);

      if (checkEmailBlur() && checkPhoneBlur()) {
        loader.style.display = "block";
        $.ajax({
          url: "https://www.shoper.pl/ajax.php",
          headers: {},
          method: "POST",
          data: {
            action: formWrapper.parentElement.getAttribute("action"),
            type: formWrapper.parentElement.getAttribute("type"),
            source_id: formWrapper.parentElement.getAttribute("source_id"),
            package: formWrapper.parentElement.getAttribute("package"),
            phone: phoneInputValue,
            email: emailValue,
          },
          success: function (data) {
            loader.style.display = "none";
            formWrapper.parentElement.querySelector("form").style.display = "none";
            formWrapper.parentElement.querySelector(".w-form-done").style.display = "block";
            formWrapper.parentElement.querySelector("form").reset();
          },
          error: function (data) {
            loader.style.display = "none";
            formWrapper.parentElement.querySelector(".w-form-fail").style.display = "block";
            formWrapper.parentElement.querySelector(".w-form-fail").textContent = "Coś poszło nie tak, spróbuj ponownie.";
          },
        });

        if (window.dataLayer) {
          data = {
            event: "myTrackEvent",
            eventCategory: "Button modal form sent",
            eventAction: this.value,
            eventLabel: window.location.href,
            eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
          };

          dataLayer.push(data);
          // console.log(dataLayer);
        }
      } else {
        if (window.dataLayer) {
          data = {
            event: "myTrackEvent",
            eventCategory: "Button modal form error",
            eventAction: this.value,
            eventLabel: window.location.href,
            eventType: document.querySelector("[app='custom_form']").getAttribute("form"),
          };

          dataLayer.push(data);
          // console.log(dataLayer);
        }
      }
    });
  }

  // fetch

  $.ajax({
    url: "https://www.shoper.pl/ajax.php",
    headers: {},
    method: "POST",
    data: {
      action: "get_prices_list",
    },
    success: function (data) {
      document.querySelector(".pricelist__toggle").style.opacity = 1;
      let regular = data.price;
      let promotion = data.promotion;

      // Standard Gross 1 month price
      let standardWholePriceGross = regular.standard[1].gross;
      let standardMainPartGross = standardWholePriceGross.toString().split(".")[0];
      let standardSparePartGross = standardWholePriceGross.toString().split(".")[1];
      // Standard Net 1 month price
      let standardWholePriceNet = regular.standard[1].net;
      let standardMainPartNet = standardWholePriceNet.toString().split(".")[0];
      let standardSparePartNet = standardWholePriceNet.toString().split(".")[1];
      // Premium  Gross 1 month price
      let premiumWholePriceGross = regular.premium[1].gross;
      let premiumMainPartGross = premiumWholePriceGross.toString().split(".")[0];
      let premiumSparePartGross = premiumWholePriceGross.toString().split(".")[1];
      // Premium  Net 1 month price
      let premiumWholePriceNet = regular.premium[1].net;
      let premiumMainPartNet = premiumWholePriceNet.toString().split(".")[0];
      let premiumSparePartNet = premiumWholePriceNet.toString().split(".")[1];
      // Enterprise Gross 1 month price
      let enterpriseWholePriceGross = regular.enterprise[1].gross;
      let enterpriseMainPartGross = enterpriseWholePriceGross.toString().split(".")[0];
      let enterpriseSparePartGross = enterpriseWholePriceGross.toString().split(".")[1];
      // Enterprise Net 1 month price
      let enterpriseWholePriceNet = regular.enterprise[1].net;
      let enterpriseMainPartNet = enterpriseWholePriceNet.toString().split(".")[0];
      let enterpriseSparePartNet = enterpriseWholePriceNet.toString().split(".")[1];

      // Standard Gross year price
      let standardWholePriceGrossY = promotion.price.standard[12].month.gross;
      let standardMainPartGrossY = standardWholePriceGrossY.toString().split(".")[0];
      let standardSparePartGrossY = standardWholePriceGrossY.toString().split(".")[1];
      // Standard Net year price
      let standardWholePriceNetY = promotion.price.standard[12].month.net;
      let standardMainPartNetY = standardWholePriceNetY.toString().split(".")[0];
      let standardSparePartNetY = standardWholePriceNetY.toString().split(".")[1];
      // Premium  Gross year price
      let premiumWholePriceGrossY = regular.premium[12].month.gross;
      let premiumMainPartGrossY = premiumWholePriceGrossY.toString().split(".")[0];
      let premiumSparePartGrossY = premiumWholePriceGrossY.toString().split(".")[1];
      // Premium  Net year price
      let premiumWholePriceNetY = regular.premium[12].month.net;
      let premiumMainPartNetY = premiumWholePriceNetY.toString().split(".")[0];
      let premiumSparePartNetY = premiumWholePriceNetY.toString().split(".")[1];
      // Enterprise Gross year price
      let enterpriseWholePriceGrossY = regular.enterprise[12].month.gross;
      let enterpriseMainPartGrossY = enterpriseWholePriceGrossY.toString().split(".")[0];
      let enterpriseSparePartGrossY = enterpriseWholePriceGrossY.toString().split(".")[1];
      // Enterprise Net year price
      let enterpriseWholePriceNetY = regular.enterprise[12].month.net;
      let enterpriseMainPartNetY = enterpriseWholePriceNetY.toString().split(".")[0];
      let enterpriseSparePartNetY = enterpriseWholePriceNetY.toString().split(".")[1];
      // initial values
      priceBoxStandard.textContent = standardWholePriceNetY;
      priceBoxPremium.textContent = premiumWholePriceNetY;
      priceBoxEnterprise.textContent = enterpriseWholePriceNetY;

      priceBoxStandardClone.textContent = standardWholePriceNetY;
      priceBoxPremiumClone.textContent = premiumWholePriceNetY;
      priceBoxEnterpriseClone.textContent = enterpriseWholePriceNetY;

      priceBoxStandardRegular.textContent = "";
      priceBoxPremiumRegular.textContent = "";
      priceBoxEnterpriseRegular.textContent = "";

      priceBoxStandardRegularMini.textContent = "";
      priceBoxPremiumRegularMini.textContent = "";
      priceBoxEnterpriseRegularMini.textContent = "";

      standardBadge.style.display = "none";
      premiumBadge.style.display = "none";
      enterpriseBadge.style.display = "none";

      let standardWholePriceGrossComma = standardWholePriceGross.replace(".", ",");
      let premiumWholePriceGrossComma = premiumWholePriceGross.replace(".", ",");
      let enterpriseWholePriceGrossComma = enterpriseWholePriceGross.replace(".", ",");

      let standardWholePriceNetComma = standardWholePriceNet.replace(".", ",");
      let premiumWholePriceNetComma = premiumWholePriceNet.replace(".", ",");
      let enterpriseWholePriceNetComma = enterpriseWholePriceNet.replace(".", ",");

      function checkValues() {
        boxStandard = document.querySelector("#pricebox-standard");
        boxPremium = document.querySelector("#pricebox-premium");
        boxEnterprise = document.querySelector("#pricebox-enterprise");
        // gross & monthly
        if (checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = gross[$("html").attr("lang")];
          boxLabelPremium.textContent = gross[$("html").attr("lang")];
          boxLabelEnterprise.textContent = gross[$("html").attr("lang")];
          priceBoxStandard.textContent = standardMainPartGross;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartGross;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGross}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGross;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = `,${enterpriseSparePartGross}`;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // net & monthly
        } else if (!checkboxPrice.checked && !checkboxYear.checked) {
          boxLabelStandard.textContent = net[$("html").attr("lang")];
          boxLabelPremium.textContent = net[$("html").attr("lang")];
          boxLabelEnterprise.textContent = net[$("html").attr("lang")];
          priceBoxStandard.textContent = standardMainPartNet;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNet;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNet;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = "";
          priceBoxPremiumRegular.textContent = "";
          priceBoxEnterpriseRegular.textContent = "";
          standardBadge.style.display = "none";
          premiumBadge.style.display = "none";
          enterpriseBadge.style.display = "none";
          // gross & yearly
        } else if (checkboxPrice.checked && checkboxYear.checked) {
          boxLabelStandard.textContent = gross[$("html").attr("lang")];
          boxLabelPremium.textContent = gross[$("html").attr("lang")];
          boxLabelEnterprise.textContent = gross[$("html").attr("lang")];
          priceBoxStandard.textContent = standardMainPartGrossY;
          priceBoxStandard.nextElementSibling.children[0].textContent = `,${standardSparePartGrossY}`;
          priceBoxPremium.textContent = premiumMainPartGrossY;
          priceBoxPremium.nextElementSibling.children[0].textContent = `,${premiumSparePartGrossY}`;
          priceBoxEnterprise.textContent = enterpriseMainPartGrossY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceGrossComma} ${currency[$("html").attr("lang")]}`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceGrossComma} ${currency[$("html").attr("lang")]}`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceGrossComma} ${currency[$("html").attr("lang")]}`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        } else {
          // net & yearly
          boxLabelStandard.textContent = net[$("html").attr("lang")];
          boxLabelPremium.textContent = net[$("html").attr("lang")];
          boxLabelEnterprise.textContent = net[$("html").attr("lang")];
          priceBoxStandard.textContent = standardMainPartNetY;
          priceBoxStandard.nextElementSibling.children[0].textContent = ``;
          priceBoxPremium.textContent = premiumMainPartNetY;
          priceBoxPremium.nextElementSibling.children[0].textContent = ``;
          priceBoxEnterprise.textContent = enterpriseMainPartNetY;
          priceBoxEnterprise.nextElementSibling.children[0].textContent = ``;
          priceBoxStandardRegular.textContent = `${standardWholePriceNetComma} ${currency[$("html").attr("lang")]}`;
          priceBoxPremiumRegular.textContent = `${premiumWholePriceNetComma} ${currency[$("html").attr("lang")]}`;
          priceBoxEnterpriseRegular.textContent = `${enterpriseWholePriceNetComma} ${currency[$("html").attr("lang")]}`;
          standardBadge.style.display = "block";
          premiumBadge.style.display = "block";
          enterpriseBadge.style.display = "block";
        }
        // duplicate values to the compact cards at the bottom
        boxStandardClone.innerHTML = boxStandard.innerHTML;
        boxPremiumClone.innerHTML = boxPremium.innerHTML;
        boxEnterpriseClone.innerHTML = boxEnterprise.innerHTML;

        let compactCardsGrid = document.querySelector("#compact-cards");
        let badgesInCompact = compactCardsGrid.querySelectorAll(".badge-new");
        // badgesInCompact.forEach((badge) => {
        //   badge.remove();
        // });
      }
      //  event when net/gross clicked
      togglePrice.addEventListener("click", () => {
        checkboxPrice.click();
        checkValues();
      });
      //  event when monthly/yearly clicked
      toggleYear.addEventListener("click", () => {
        checkboxYear.click();
        checkValues();
      });
      toggleYear.click();

      loaderItems = document.querySelectorAll(".loader-xl");

      loaderItems.forEach((n) => {
        n.style.display = "none";
      });
    },
    error: function (err) {},
  });

  accordionFirstChild[1].click();
});

// $.ajax({
//   url: "https://www.shoper.pl/ajax.php",
//   headers: {},
//   method: "POST",
//   data: {
//     action: "get_promotion",
//   },
//   success: function (data) {
//     // header
//     let headerPercentage = document.querySelector("[header='percentage']");
//     let discountPercentage = data.package.discount;
//     headerPercentage.textContent = `${discountPercentage}%`;
//   },
//   error: function () {
//     // console.log("error");
//   },
// });

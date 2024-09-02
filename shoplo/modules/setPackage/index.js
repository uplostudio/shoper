import { TRANSLATE } from "./constansts";
const dataPackage = document.querySelectorAll("[data-package]");
const condition = () => dataPackage.length > 0;

const initialize = async () => {
  try {
    let priceList = await getPriceList();

    dataPackage.forEach((item, index) => {
      item.addEventListener("click", () => {
        setPackage(item.getAttribute("data-package"));
        setPrice(item.getAttribute("data-package-name"), priceList);
      });
    });

    document.querySelector(".trial-close-btn").addEventListener("click", () => {
      const packageField = document.querySelector(
        '#create_trial_step1 input[name="package"]'
      );
      if (packageField) {
        packageField.remove();
      }
    });
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};

const setPackage = (packageID) => {
  if (packageID !== "") {
    const formTrialStep1 = document.querySelector("#create_trial_step1");
    formTrialStep1.insertAdjacentHTML(
      "beforeend",
      `<input type="hidden" name="package" value="${packageID}" />`
    );
  }
};

const setPrice = (packageName, priceList) => {

    let period = document.querySelector('#create_trial_step1 input[name="period"]') ? 
        document.querySelector('#create_trial_step1 input[name="period"]').value :
        12;
    let time = period === "1" ? "month" : "year";

    let price = priceList.promotion.price[packageName][period] ? 
            priceList.promotion.price[packageName][period][time].net :
            priceList.price[packageName][period].net;
    let discount = priceList.promotion.price[packageName][period] ?
            priceList.promotion.price[packageName].discount :
            false;
    let oldPrice = priceList.promotion.price[packageName][period] ?
        priceList.price[packageName][period][time].net :
        priceList.price[packageName][period].net

    let discountElmentOnPage = $('.input-radio-discount');
    if ( discount ) {
        discountElmentOnPage.css('display', 'block');
        discountElmentOnPage.text(`${discount}% taniej`);
    } else {
        discountElmentOnPage.css('display', 'none');
    }
    
    let additionalInfoAboutPackageElement = $('.input-radio-additional-info');

    if ( time === "month" ) {
        additionalInfoAboutPackageElement
          .html(
            TRANSLATE[$("html").attr("lang")].info_month
              .replace('[package]', ucfirst(packageName))
              .replace('[price]', price )
          );
    } 

    if ( time === "year" ) {
        additionalInfoAboutPackageElement
          .html(
            TRANSLATE[$("html").attr("lang")].info_year
              .replace('[package]', ucfirst(packageName))
              .replace('[price]', price)
              .replace('[oldprice]', oldPrice)
          );
    }
};

const getPriceList = async () => {
  try {
    const response = await fetch(`https://backend.webflow.prod.shoper.cloud/?action=get_prices_list`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching price list:", error);
    throw error;
  }
};
const ucfirst = (str) => {
    if (!str) return str; // Sprawdź, czy str jest pustym stringiem
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default {
  condition,
  initialize,
};

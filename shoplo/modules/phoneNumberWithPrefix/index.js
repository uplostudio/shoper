import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import "./style.css";

const phoneNumberWithPrefixFieds = $('[data-phone-field-prefix="true"]');
const condition = () => phoneNumberWithPrefixFieds.length > 0;

const initialize = () => {
  $(phoneNumberWithPrefixFieds).each((index, phoneField) => {
    intlTelInput(phoneField, {
      utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.2.12/build/js/utils.js",
      preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
      autoInsertDialCode: false,
      nationalMode: false,
      separateDialCode: true,
      autoPlaceholder: "off",
      initialCountry: "pl",
      showSelectedDialCode: true,
      countrySearch: false
    });
  });

};

export default {
  condition,
  initialize,
};

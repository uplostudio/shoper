import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/css/intlTelInput.css';

const phoneNumberWithPrefixFieds = $('[data-phone-field-prefix="true"]');
const condition = () => phoneNumberWithPrefixFieds.length > 0;

const initialize = () => {
    $(phoneNumberWithPrefixFieds).each( ( index, phoneField ) => {
        intlTelInput(phoneField, {
            utilsScript: "intl-tel-input/build/js/utils.js",
        preferredCountries: ["pl", "de", "ie", "us", "gb", "nl"],
        autoInsertDialCode: false,
        nationalMode: false,
        separateDialCode: true,
        autoPlaceholder: "off",
        initialCountry: "pl",
        showSelectedDialCode: true,
        });
    } ); 
};

export default {
  condition,
  initialize,
};

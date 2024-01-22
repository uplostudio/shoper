import $ from 'jquery';
import utm from './modules/utm';
import insertToFormHiddenInput from './modules/insertToFormHiddenInput';
import countries from './modules/countries';
import handleRadioPayNow from './modules/handleRadioPayNow';
import clientTypeFields from './modules/clientTypeFields';
import phoneNumberWithPrefix from './modules/phoneNumberWithPrefix';

const modules = [
    utm,
    insertToFormHiddenInput,
    countries,
    handleRadioPayNow,
    clientTypeFields,
    phoneNumberWithPrefix
];

modules.forEach(module => {
    if (module.condition()) {
        module.initialize();
    }
})
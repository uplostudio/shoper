import $ from 'jquery';
import utm from './modules/utm';
import insertToFormHiddenInput from './modules/insertToFormHiddenInput';
import countries from './modules/countries';
import handleRadioPayNow from './modules/handleRadioPayNow';
import clientTypeFields from './modules/clientTypeFields';
import phoneNumberWithPrefix from './modules/phoneNumberWithPrefix';
import formValidation from './modules/formValidation';
import formHandler from './modules/formHandler';

const modules = [
    utm,
    insertToFormHiddenInput,
    countries,
    handleRadioPayNow,
    clientTypeFields,
    phoneNumberWithPrefix,
    formValidation,
    formHandler
];

modules.forEach(module => {
    if (module.condition()) {
        module.initialize();
    }
})
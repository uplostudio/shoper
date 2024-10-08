import $ from 'jquery';
import removeDataLocalStorage from './modules/removeDataLocalStorage'
import utm from './modules/utm';
import insertToFormHiddenInput from './modules/insertToFormHiddenInput';
import countries from './modules/countries';
import handleRadioPayNow from './modules/handleRadioPayNow';
import clientTypeFields from './modules/clientTypeFields';
import phoneNumberWithPrefix from './modules/phoneNumberWithPrefix';
import formValidation from './modules/formValidation';
import formHandler from './modules/formHandler';
// import checkNipField from './modules/checkNipField';
import trialSetSpecialFields from './modules/trialSetSpecialFields';
import dataLayer from './modules/dataLayer';
import setPackage from './modules/setPackage';
import preoidToggler from './modules/preoidToggler';

const modules = [
    removeDataLocalStorage,
    utm,
    insertToFormHiddenInput,
    countries,
    handleRadioPayNow,
    clientTypeFields,
    phoneNumberWithPrefix,
    formValidation,
    formHandler,
    // checkNipField,
    trialSetSpecialFields,
    dataLayer,
    setPackage,
    preoidToggler
];

modules.forEach(module => {
    if (module.condition()) {
        module.initialize();
    }
})
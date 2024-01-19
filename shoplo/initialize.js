import utm from './modules/utm';
import insertToFormHiddenInput from './modules/insertToFormHiddenInput';
import countries from './modules/countries';

const modules = [
    utm,
    insertToFormHiddenInput,
    countries
];

modules.forEach(module => {
    if (module.condition()) {
        module.initialize();
    }
})
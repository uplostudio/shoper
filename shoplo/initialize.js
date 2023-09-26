import utm from './modules/Utm';
import insertToFormHiddenInput from './modules/InsertToFormHiddenInput';

const modules = [
    utm,
    insertToFormHiddenInput
];

modules.forEach(module => {
    if (module.condition()) {
        module.initialize();
    }
})
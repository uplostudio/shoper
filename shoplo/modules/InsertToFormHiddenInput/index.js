import { OPTIONS } from "../utm/constants";
const forms = document.querySelectorAll('form');
const condition = () => forms.length > 0;
 
const initialize = () => {
    forms.forEach( ( form ) => {
        OPTIONS.fields.forEach( ( field ) => {
            setUTMHiddenInput( form, field );
        });
    });
}
 
const setUTMHiddenInput = (form, param) => {
    let value;

    if (value = localStorage.getItem(param)) {

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      hiddenInput.name = 'adwords[' + param + ']';
      hiddenInput.value = value;
      form.appendChild(hiddenInput)

    }
}

export default {
    condition,
    initialize
};
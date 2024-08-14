const preoidTogglers = document.querySelectorAll('[data-toggle="billing-period"]');
const condition = () => preoidTogglers.length > 0

const initialize = () => {
    const form = document.querySelector('#create_trial_step1');
    preoidTogglers.forEach( (preoidToggler) => {
        preoidToggler.addEventListener('click', (e) => {
            changeElementActive(preoidToggler);
            if ( form ) {
                let preoidValue = document.querySelector('.togglebuttonactive').getAttribute('data-period');
                removeHiddenInput( form, 'period' );
                setHiddenInput( form, 'period', preoidValue);
            }
        });
    });
    
};

const changeElementActive = (preoidToggler) => {
    preoidToggler.querySelectorAll('[data-period]').forEach((item) => {
        item.classList.toggle('togglebuttonactive');
    });
};

const setHiddenInput = (form, name, value) => {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = name;
    hiddenInput.value = value;
    form.appendChild(hiddenInput)
};

const removeHiddenInput = (form, name) => {
    const preoidInput = form.querySelector(`input[name="${name}"]`);
    if( preoidInput ) {
        preoidInput.remove();
    }
};

export default {
  condition,
  initialize,
};

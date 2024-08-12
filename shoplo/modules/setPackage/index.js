const dataPackage = document.querySelectorAll('[data-package]');
const condition = () => dataPackage.length > 0

const initialize = () => {
    dataPackage.forEach( (item, index) => {
        item.addEventListener('click', () => {
            setPackage(item.getAttribute('data-package'));
        });
    });

    document.querySelector('.trial-close-btn').addEventListener('click', () => {
        const packageField = document.querySelector('#create_trial_step1 input[name="package"]');
        if ( packageField ) {
            packageField.remove();
        }
    });
};

const setPackage = ( packageID ) => {
    const formTrialStep1 = document.querySelector('#create_trial_step1');
    formTrialStep1.insertAdjacentHTML('beforeend',`<input type="hidden" name="package" value="${packageID}" />`);
}

export default {
  condition,
  initialize,
};

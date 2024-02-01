const formsTrial = $('[id^=create_trial_step]');
const condition = () => formsTrial.length > 0;
 
const initialize = () => {
  let LSdata = JSON.parse(localStorage.getItem('trial'));
  if ( LSdata ) {
    LSdata = atob(LSdata);
    formsTrial.each( ( index, formTrial) => {
      $(formTrial).append('<input name="sid" value="' + LSdata[1] + '" type="hidden" />');

      if ( $(formTrial).attr('id') === "create_trial_step2" ) {
        $($(formTrial).find('#trial-host').get(0)).text(LSdata[5])
      }
      
      if ( $(formTrial).attr('id') === "create_trial_step3" ) {
        if ( LSdata[2] ) {
          $($(formTrial).find('input[name="email"]').get(0)).val(LSdata[2])
        }

        if ( LSdata[4] ) {
          window.intlTelInputGlobals.instances[
            $($(formTrial).find('input[name="phone"]').get(0)).attr("data-intl-tel-input-id")
          ].setNumber(LSdata[4]);

        }
      }
    });
  }
}

export default {
    condition,
    initialize
};
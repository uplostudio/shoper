const formsTrial = $("[id^=create_trial_step]");
const condition = () => formsTrial.length > 0;

const initialize = () => {
  let LSdata = localStorage.getItem("trial");
  if (LSdata) {
    LSdata = JSON.parse(atob(LSdata));
    formsTrial.each((index, formTrial) => {
      $(formTrial).append(
        '<input name="sid" value="' + LSdata[1] + '" type="hidden" />'
      );

      if ($(formTrial).attr("id") === "create_trial_step2") {
        $($(formTrial).find("#trial-host").get(0)).text(LSdata[5]);
      }

      if ($(formTrial).attr("id") === "create_trial_step3") {
        if (LSdata[2]) {
          $($(formTrial).find('input[name="email"]').get(0)).val(LSdata[2]);
        }

        if (LSdata[4]) {
          $($(formTrial).find('input[name="number_phone"]').get(0)).val(
            LSdata[4]
          );
        }
      }
    });
  }
};

export default {
  condition,
  initialize,
};

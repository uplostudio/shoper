// step_one.js

$(document).ready(()=>{
    let ajaxRequest;
    let currentSID = null;

    const generateErrorMessage = type=>{
        const messages = {
            email: "Podaj poprawny adres e-mail.",
            required: "To pole jest wymagane."
        };
        return messages[type] || messages.required;
    }
    ;

    const validateEmail = $field=>{
        const email = $field.val().trim();
        const error = !email ? generateErrorMessage('required') : !SharedUtils.EMAIL_REGEX.test(email) ? generateErrorMessage('email') : null;

        $field.next('.error-box').remove();
        if (error) {
            $field.after(`<span class="error-box">${error}</span>`);
            $field.removeClass('valid').addClass('invalid');
            $field.siblings('.new__input-label').removeClass('valid active').addClass('invalid');
        } else {
            $field.removeClass('invalid').addClass('valid');
            $field.siblings('.new__input-label').removeClass('invalid').addClass('valid');
        }
        return error;
    }
    ;

    const handleFormSubmission = (e,$form)=>{
        e.preventDefault();
        const $emailField = $form.find('[data-type="email"]');
        if (validateEmail($emailField))
            return;

        const $wFormFail = $form.next().next();
        const $loader = $form.find(".loading-in-button.is-inner");
        $loader.show();

        if (ajaxRequest && ajaxRequest.abort) {
            ajaxRequest.abort();
        }

        const formData = {
            action: $form.data('action'),
            email: $emailField.val(),
            "adwords[gclid]": window.myGlobals.gclidValue,
            "adwords[fbclid]": window.myGlobals.fbclidValue,
            analyticsId: window.myGlobals.analyticsId,
            affiliant: $form.data('affiliant') || "",
            ...DataLayerGatherers.getValueTrackData()
        };

        if (currentSID) {
            formData.sid = currentSID;
        }

        ajaxRequest = $.ajax({
            url: SharedUtils.API_URL,
            method: 'POST',
            timeout: 30000,
            data: formData
        });

        ajaxRequest.then(response=>{
            SharedUtils.handleResponse(response, $form, $emailField, $wFormFail, true, 1);
        }
        ).catch(error=>{
            SharedUtils.handleResponse(error, $form, $emailField, $wFormFail, false, 1);
        }
        ).always(()=>{
            $loader.hide();
            ajaxRequest = null;
        }
        );
    }
    ;

    const setupValidation = ()=>{
        $(document).on('blur', '[data-action="create_trial_step1"] [data-type="email"]', function() {
            validateEmail($(this));
        });

        $(document).on('keydown', '[data-action="create_trial_step1"] [data-type="email"]', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleFormSubmission(e, $(this).closest('form'));
            }
        });

        $(document).on('click', '[data-action="create_trial_step1"] [data-form="submit-step-one"]', function(e) {
            handleFormSubmission(e, $(this).closest('form'));
        });

        $(document).on('submit', '[data-action="create_trial_step1"]', function(e) {
            handleFormSubmission(e, $(this));
        });
    }
    ;

    const $openTrialModalButton = $("[data-app='open_trial_modal_button']");
    if ($openTrialModalButton.length) {
        $openTrialModalButton.on('click', ()=>{
            $("[data-app='create_trial_step1_modal']").addClass("modal--open");
            $("body").addClass("overflow-hidden");
        }
        );
    }

    $(document).on('trialStepComplete', function(event, completedStep, data) {
        if (completedStep === 1) {
            const $modalTrialOne = $('[data-element="modal_trial_one"]');
            const $modalTrialTwo = $('[data-element="modal_trial_two"]');

            if ($modalTrialOne.length) {
                $modalTrialOne.hide();
            }
            if ($modalTrialTwo.length) {
                $modalTrialTwo.show();
            }

            // Additional actions after successful step 1 completion
            console.log("Step 1 completed successfully");
            // You can add more actions here if needed
        }
    });

    setupValidation();
    SharedUtils.checkAndUpdateSID();
    setInterval(SharedUtils.checkAndUpdateSID, 60 * 60 * 1000);

    if (typeof updateAnalytics === 'function') {
        updateAnalytics();
    } else {
        console.warn('updateAnalytics function is not defined');
    }

    const cleanup = ()=>{
        if (ajaxRequest) {
            ajaxRequest.abort();
        }
        $(document).off('blur', '[data-action="create_trial_step1"] [data-type="email"]');
        $(document).off('keydown', '[data-action="create_trial_step1"] [data-type="email"]');
        $(document).off('click', '[data-action="create_trial_step1"] [data-form="submit-step-one"]');
        $(document).off('submit', '[data-action="create_trial_step1"]');
        $("[data-app='open_trial_modal_button']").off('click');
    }
    ;

    const forceReload = ()=>{
        cleanup();
        requestAnimationFrame(()=>{
            window.location.reload(true);
        }
        );
    }
    ;

    $(window).on('beforeunload', cleanup);
}
);

$(document).on('formSubmissionComplete', function(event, isSuccess, $form, $emailField, data) {
    if (isSuccess) {
        DataLayerGatherers.pushEmailSubmittedData(window.myGlobals.clientId, window.myGlobals.shopId, $form.data('action'), $emailField.val());
    } else {
        DataLayerGatherers.pushTrackEventError($form.data('action'), $form.find("#label").text(), $emailField.val());
    }
});

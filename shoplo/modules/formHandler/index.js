const forms = $("form");
const condition = () => forms.length > 0;

const initialize = () => {
    $(document).on('submitFormSuccess', function( e, form ) {
        var formData = bindDataFromForm($(form));
        formData.phone = window.intlTelInputGlobals
            .instances[
                $($(form).find('[name="phone"]')
                    .get(0))
                    .attr('data-intl-tel-input-id')
            ]
            .getNumber();
        console.log( formData );
    });

    $(document).on('submitFormError', function( e, form ) {
        console.error( "Error ");
    });
}

const bindDataFromForm = (form) => {
    var formData = $(form).serializeArray();
    var formValues = {};
    $.each(formData, function (index, field) {
      formValues[field.name] = field.value;
    });
  
    return formValues;
  };
 
export default {
    condition,
    initialize
};
$(document).ready(function () {

    const messages = {
        'pl': {
            'required': 'To pole jest wymagane',
            'required_checkbox': 'To pole musi zostać zaznaczone',
            'email': 'Podaj poprawny adres e-mail',
            'phone': 'Minimum 9 cyfr',
            'text': 'Min. 3 znaki',
        }, 
        'en': {
            'required': 'This field is required',
            'required_checkbox': 'This box must be checked',
            'email': 'Please enter a valid email address',
            'phone': 'Minimum 9 digits',
            'text': 'Minimum 3 characters',
        }
    };
    // Function which get all fields form form and save to one object data
    
    function bindDataFromForm(form) {
      var formData = $(form).serializeArray();
      var formValues = {};
      $.each(formData, function (index, field) {
        formValues[field.name] = field.value;
      });

      return formValues;
    }

    // Function set error for field

    function setErrorField( messege, field ) {
        let htmlMessege = `<div class="error-field"><img loading="lazy" alt="" class="error-field-image" src="https://global-uploads.webflow.com/61910111dc1f692d2eaf3138/64c3a210e743d0c2d6d9bfee_6374d2281cf709d489ffc789_ant-design_exclamation-circle-filled.svg"><div class="text-block-10">${messege}</div></div>`

        if( $( field ).attr( "type" ) === "checkbox" ) {
            if( !$(field).next().is('div.error-field') ) {
                $(field).parent().after( htmlMessege );
                $(field).prev().addClass('error-checkbox');
            }
        } else {
            if( !$(field).next().is('div.error-field') ) {
                $(field).after( htmlMessege );
            }
        }
    }

    // Function remove error for one field with error

    function removeError( field ) {
      if ( $( field ).attr( "type" ) !== "checkbox" ) {
        if ( $(field).next().is('div.error-field') ) {
          $(field).next().remove();
        }
      } else {
        if ( $(field).parent().next().is('div.error-field') ) {
          $(field).parent().next().remove();
          $(field).prev().removeClass('error-checkbox');
        }
      }
    }

    // Function clear all error with form

    function removeErrors( formFields ) {
        $( formFields ).each( function() {
            removeError(this);
        });
    }

    // Function check field type email

    function valideEmail(field) {
      let fieldValue = $(field).val();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if ( !emailRegex.test(fieldValue ) ) {
        setErrorField( messages[$('html').attr('lang')].email, field );
      }
    }

    // Function check field type number

    function validePhoneNumber(field) {
      let fieldValue = $(field).val();
      const phoneRegex = /^\d{9,15}$/;
      if ( !phoneRegex.test(fieldValue ) ) {
        setErrorField( messages[$('html').attr('lang')].phone, field );
      }
    }

    // Function check field type text

    function valideFieldText(field) {
      let fieldValue = $(field).val();
      if ( fieldValue.length <= 2 ) {
        setErrorField( messages[$('html').attr('lang')].text, field );
      }
    }

    // Function check field type checkbox

    function validRequired( field ) {
        if ( !$( field ).attr('type') !== "checkbox" && $( field ).val().length == 0 ) {
            setErrorField( messages[$('html').attr('lang')].required, field );
        }
        if ( $( field ).attr('type') === "checkbox" && !$( field ).prop( 'checked' ) ) {
            setErrorField( messages[$('html').attr('lang')].required_checkbox, field );
        }

    }

    // Validate field form

    function validateFieldForm( field ) {
      if ( $( field ).attr( 'data-required') ) {
        validRequired( field );
      }

      switch ( $( field ).attr( 'type' ) ) {
        case "email":
          valideEmail( field );
          break;
        case "tel":
          validePhoneNumber( field );
          break;
        case "text":
          valideFieldText( field );
          break;
        default:
      }

    }

    // Validate form function

    function validateForm(form) {
      let formFields = $(form).find("input, textarea");
      removeErrors( formFields );
      $(formFields).each(function (index, item) {
        validateFieldForm( item );
      });
    }

    // Main function to support send data with form
    // Support all form with page

    $("form")
      .children('input[type="submit"]')
      .on("click", async function (e) {
        e.preventDefault();

        let form = $(e.target).parent("form");
        validateForm(form);

        let errorsElemnet = $('div.error-field');

        if ( $( errorsElemnet ).length === 0 ) {
            var formData = bindDataFromForm($(form));

            $.ajax({
                url: "https://www.shoper.pl/ajax.php",
                headers: {},
                method: "POST",
                data: formData,
                success: function (data) {
                  if ( data.message ) {
                    $(form).next().find('div').text( data.message );
                  }

                  $(document).trigger('submitSuccess', form );
                } 
            });

            form.submit();
        } else {
          $(document).trigger('submitError', form );

          $( errorsElemnet ).each( function( index, field ) {
            let eventLabel = $( field ).prev().attr('type') ? $( field ).prev().attr('type') : $( field ).prev().find('input').attr('type');
            sendDataLayer( 'myTrackEvent', "errorFormEvent", false, false, eventLabel, $( field ).prev().val() );
          });
        }
   
    });

    // Validation field on event focusout

    $("input, textarea").on('focusout', function() {
      removeError( this );
      validateFieldForm( this );
    });

    // Data Layer Support
   
    $( '[data-event]' ).on( 'click', function( e ) {
        sendDataLayer( 'myTrackEvent', "Button modal opened", $( this ).text(),  $( this ).data('event') );
    });

    $(document).on('submitSuccess', function( e, form ) {

      sendDataLayer( 'myTrackEvent', 'Button modal form sent', $( form ).find( '[type="submit"]' ).val(), $( form ).attr( 'id' )  );
     
    });

    $(document).on('submitError', function( e, form ) {

      sendDataLayer( 'myTrackEvent', 'Button modal form error', $( form ).find( '[type="submit"]' ).val(), $( form ).attr( 'id' )  );
     
    });

    // Function send dataLayer

    function sendDataLayer( eventName, eventCategory = false, eventAction = false, eventType = false, eventLabel = window.location.href, eventValue = false ) {
      let data = {};
  
     if ( eventName === "myTrackEvent" ) {
  
          data.event = eventName;
          if ( eventCategory ) { data.eventCategory = eventCategory; }
          if ( eventAction ) { data.eventAction = eventAction; }
          if ( eventType ) { data.eventType = eventType; }
          if ( eventLabel ) { data.eventLabel = eventLabel; }
          if ( eventValue ) { data.eventValue = eventValue; }
  
     }
  
     if (window.dataLayer && data ) {
          dataLayer.push(data);
     } else {
        console.log( data );
     }

    }
});
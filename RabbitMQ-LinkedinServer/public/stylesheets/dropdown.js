
$(document).ready(function() {
    // You don't need to care about onDropdownShow, onDropdownHide options
    // and adjustByScrollHeight(), adjustByHeight() methods
    // They are for this specific demo
    $('#multiselectForm')
        .find('[name="gender"]')
            .multiselect({
                onChange: function(element, checked) {
                    $('#multiselectForm').formValidation('revalidateField', 'gender');

                    adjustByScrollHeight();
                },
                onDropdownShown: function(e) {
                    adjustByScrollHeight();
                },
                onDropdownHidden: function(e) {
                    adjustByHeight();
                }
            })
            .end()
        .find('[name="browsers"]')
            .multiselect({
                // Re-validate the multiselect field when it is changed
                onChange: function(element, checked) {
                    $('#multiselectForm').formValidation('revalidateField', 'browsers');

                    adjustByScrollHeight();
                },
                onDropdownShown: function(e) {
                    adjustByScrollHeight();
                },
                onDropdownHidden: function(e) {
                    adjustByHeight();
                }
            })
            .end()
        .formValidation({
            framework: 'bootstrap',
            // Exclude only disabled fields
            // The invisible fields set by Bootstrap Multiselect must be validated
            excluded: ':disabled',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                gender: {
                    validators: {
                        notEmpty: {
                            message: 'The gender is required'
                        }
                    }
                },
                browsers: {
                    validators: {
                        callback: {
                            message: 'Please choose 2-3 browsers you use for developing',
                            callback: function(value, validator, $field) {
                                // Get the selected options
                                var options = validator.getFieldElements('browsers').val();
                                return (options != null
                                        && options.length >= 2 && options.length <= 3);
                            }
                        }
                    }
                }
            }
        });

    // You don't need to care about these methods
    function adjustByHeight() {
        var $body   = $('body'),
            $iframe = $body.data('iframe.fv');
        if ($iframe) {
            // Adjust the height of iframe when hiding the picker
            $iframe.height($body.height());
        }
    }

    function adjustByScrollHeight() {
        var $body   = $('body'),
            $iframe = $body.data('iframe.fv');
        if ($iframe) {
            // Adjust the height of iframe when showing the picker
            $iframe.height($body.get(0).scrollHeight);
        }
    }
});

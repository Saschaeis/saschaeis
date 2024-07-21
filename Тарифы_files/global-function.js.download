function addGlobalCheckbox(element) {
    var checkOnlyRegister = false;

    if (element.find('.register-form.state-form').length > 0) {
        element = element.find('.register-form.state-form');
        checkOnlyRegister = true;
    }

    if (element.find('.login-form.state-form').length > 0 && !checkOnlyRegister) {
        return function (params) {
            return true;
        };
    }

    if (element.find('.form-content').length > 0) {
        element = element.find('.form-content');
    }

    if (window.globalCheckboxEnabled) {
        var checked = window.persodataConfirm ? 'checked' : '';
        var $checkboxEl = $('<div class="global-confirm-checkbox-block confirm-rules-checkbox">' +
            '<label>' +
            '<input class="global-confirm-checkbox" type="checkbox" ' + checked + ' name="globalConfirmCheckbox" >' +
            '<span class="checkbox-text">' + window.globalCheckboxText + '</span>' +
            '</label>' +
            '</div>');

        var $checkboxInput = $checkboxEl.find('input')
        var firstSubmitButton = element.find('button[type=submit]');
        // if (firstSubmitButton.length > 0 && false) {
        //     $checkboxEl.insertBefore(firstSubmitButton)
        // } else {
            $checkboxEl.appendTo(element);
        // }
    }

    if (window.checkboxMailingEnabled) {
        var checked = window.checkboxMailingChecked ? 'checked' : '';
        var input = '<div class="xdget-formField">' +
            '<label>' +
            '<input type="checkbox" ' + checked + ' class="append-handle-input" name="confirmMailingCheckbox" />' +
            '<span class="checkbox-text">' + window.checkboxMailingText + '</span>' +
            '</label>' +
            '</div>';

        var checkboxMailing = $(input);

        if (element.find('.confirm-rules-checkbox').length === 1) {
            checkboxMailing.appendTo(element.find('.confirm-rules-checkbox'));
        } else {
            checkboxMailing = $('<div class="global-confirm-checkbox-block confirm-mailing-checkbox">' + input + '</div>');

            var firstSubmitButton = element.find('button[type=submit]');
            checkboxMailing.appendTo(element);
        }
    }

    return function (params) {
        if (window.globalCheckboxEnabled && !$checkboxInput.prop('checked')) {
            if (checkOnlyRegister && !(params && params.state == "register")) {
                return true;
            }

            var str = 'Чтобы отправить форму вы должны согласиться с условиями на обработку персональных данных. Отметьте соответствующую галочку';
            if (typeof Yii != 'undefined') {
                str = Yii.t('common', str);
            }

            alert(str);

            return false;
        }

        return true;
    };
}

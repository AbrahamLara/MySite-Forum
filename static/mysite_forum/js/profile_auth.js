$(document).ready(() => {

    $('#delete-thread').on('click', showModal);
    $('#delete-post').on('click', showModal);
    $('#delete-reply').on('click', showModal);
    
    $('#submit-btn').on('click', deleteSelection);

    $('#confirm-modal').on('hidden.bs.modal', emptyModalHeader);
});

const emptyModalHeader = () => {
    $('.modal-header').text('');
};

const showModal = function() {
    type = $(this).attr('object');
    $('.modal-header').text(`Are you sure you want to delete the selected ${plural[type]}?`);
    $('#confirm-modal').modal('show');
};

const deleteSelection = () => {
    let selection = $(`#${plural[type]}-table-body`).children('.selected').map(selectedType).get();
    $.ajax({
        type: 'post',
        url: `/delete_${type}_selection/`,
        data: { selection, },
        success: function (data) {
            $('#confirm-modal').modal('hide');
            for (i in data) {
                $(`#${type}-block-${data[i]}`).remove();
            }

            type = undefined;
        },
        error: function (err) {
            console.log(err);
        }
    });
};

const selectedType = function () {
    return $(this).find('input')[0].value;
};

const customCheckbox = (pk, object_type) => {
    const td = $('<td>');
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${pk}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': pk, 'id': `${object_type}-${pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    checkbox.attr('object', object_type);
    checkbox.on('click', selectBlock);
    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(custom_checkbox);
    td.append(radio_container);

    return td;
};

const selectBlock = function (e) {
    type = $(this).attr('object');
    if ($(this).prop('checked'))
        $(`#${type}-block-${e.target.value}`).addClass('selected');
    else
        $(`#${type}-block-${e.target.value}`).removeClass('selected');
};
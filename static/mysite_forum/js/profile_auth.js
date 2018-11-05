$(document).ready(function() {
    for (var i = threads_context.threads.length-1; i >= 0; i--) {
        $('#threads-container').append(getThreadBlock(threads_context.threads[i]));
    }

    $('#confirmDeletion').on('click', showModal);
    $('#submit-btn').on('click', deleteSelection);
});

const showModal = function() {
    $('#confirm-modal').modal('show');
}

const deleteSelection = function() {
    $.ajax({
        type: 'post',
        url: '/delete_selection/',
        data: {threads: $('#threads-container .selected').map(selectedThread).get()},
        success: function(data) {
            $('#confirm-modal').modal('hide');
        },
        error: function(error) {
            console.log('ERROR OCCURED');
        }
    });
}

const selectedThread = function() {
    return $(this).find('input')[0].value;
}

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'thread-block', 'id': `thread-block-${thread_data.pk}`});
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'class': '', 'id': `custom-checkbox-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': thread_data.pk, 'id': `thread${thread_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    thread_link.text(thread_data.title);

    checkbox.on('click', selectBlock);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(thread_link, custom_checkbox);
    thread_block.append(radio_container);

    return thread_block;
}

const selectBlock = function(e) {
    if ($(this).prop('checked')) {
        $(`#thread-block-${e.target.value}`).addClass('selected');
    } else
        $(`#thread-block-${e.target.value}`).removeClass('selected');
}
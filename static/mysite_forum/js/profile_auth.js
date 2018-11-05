$(document).ready(function() {
   $('#confirmDeletion').on('click', displayChanges);
   
    for (var i = threads_context.threads.length-1; i >= 0; i--) {
        $('#threads-container').append(getThreadBlock(threads_context.threads[i]));
    }

});

const displayChanges = function() {
    $('#confirm-modal').modal('show');
}

const deleteSelection = function() {
    $.ajax({
        type: 'post',
        url: '/delete_selection/',
        success: function() {
        
        },
        error: function() {
            
        }
    });
}

const getThreadBlock = function(thread_data) {
    const thread_block = $('<div>', {'class': 'thread-block'});
    const radio_container = $('<label>', {'class': 'radio-container'});
    const custom_checkbox = $('<div>', {'class': '', 'id': `custom-checkbox-${thread_data.pk}`});
    const thread_link = $('<a>', {'class': 'thread-link text-info', 'href': `/thread/${thread_data.pk}`});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': thread_data.pk, 'id': `thread${thread_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    thread_link.text(thread_data.title);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(thread_link, custom_checkbox);
    thread_block.append(radio_container);

    return thread_block;
}
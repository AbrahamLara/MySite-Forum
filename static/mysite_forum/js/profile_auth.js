$(document).ready(function() {
   $('#enable_deletion').on('click', displayChanges);
   
    // for (var i = user_threads.threads.length-1; i >= 0; i++) {
    //     $('#threads-container').append(getThreadBlock(user_threads.threads[i]));
    // }

});

const displayChanges = function() {
    if($(this).prop('checked')) {
        switchContainers('.thread-link', '.radio-container');
    } else {
        switchContainers('.radio-container', '.thread-link');
    }
}

const switchContainers = function(containerShow, containerHide) {
    $(containerShow).addClass('hide');
    $(containerHide).removeClass('hide');
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
    const custom_checkbox = $('<div>', {'id': `custom-checkbox-${thread_data.pk}`});
    const thread_link = $('<a>', {'href': `/thread/${thread_data.pk}`});
    const cutom_checkbox = $('<div>', {'class': 'hide custom-checkbox'});
    const checkbox = $('<input>', {'type': 'checkbox', 'value': thread_data.pk, 'id': `thread${thread_data.pk}`});
    const checkmark = $('<span>', {'class': 'checkmark'});

    thread_link.text(thread_data.title);

    custom_checkbox.append(checkbox, checkmark);
    radio_container.append(thread_link, custom_checkbox);
    thread_block.append(radio_container);

    return thread_block;
}
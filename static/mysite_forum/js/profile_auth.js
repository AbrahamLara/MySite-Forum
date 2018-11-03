$(document).ready(function() {
   $('#enable_deletion').on('click', displayChanges);
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

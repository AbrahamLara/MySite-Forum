$(document).ready(function() {
   $('#default_check').on('click', displayChanges);
});

const displayChanges = function() {
    
    if($(this).prop('checked')) {
        test('.thread-link', '.radio-container');
    } else {
        test('.radio-container', '.thread-link');
    }
}

const test = function(containerShow, containerHide) {
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

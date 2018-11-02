$(document).ready(function() {
   $('#optionDelete').on('click', displaySelections);
});

const displaySelections = function() {
    $('.thread-link').addClass('hide');
    $('.radio-container').removeClass('hide');
}

const deleteSelection = function() {
    $.ajax({
        type: 'post',
        url: '/delete_selection',
        success: function() {
        
        },
        error: function() {
            
        }
    });
}

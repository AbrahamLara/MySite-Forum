$(document).ready(function() {
    $('#search-bar').keyup(displayResults);
});

const displayResults = function() {
    $('.accordion').empty();

    var input = $(this).val();
    
    if (input !== '') {
        $.ajax({
            url: `search/${input}`,
            dataType: 'json',
            success: function(data) {
                populateAccordion(JSON.parse(data));
            }
        });
    }
}

const populateAccordion = function(data) {
    for(i = 0; i < data.length; i++) {
        
        card = $('<div>', {'class': 'card'});
        card_header = $('<div>', {'class': 'card-header', 'id': `${data[i].pk}`});
        h5 = $('<h5>', {'class': 'mb-0'});
        button = $('<button>', 
        {
            'class': 'btn btn-link text-info', 
            'type': 'button',
            'data-toggle': 'collapse', 
            'data-target': `#${data[i].fields.username}`,
            'aria-expanded': 'true', 
            'aria-controls': `#a${data[i].fields.username}`
        });
        collapse = $('<div>',
        {
            'class': 'collapse',
            'id': `${data[i].fields.username}`,
            'aria-labelledby': `${data[i].pk}`,
            'data-parent': '#data'
        });
        card_body = $('<div>', {'class': 'card-body'});

        button.text(`${data[i].fields.name}`);
        card_body.text(`Email: ${data[i].fields.email}\nUsername: ${data[i].fields.username}\nStaff: ${data[i].fields.is_staff}`);

        collapse.append(card_body);
        h5.append(button);
        card_header.append(h5);
        card.append(card_header, collapse)

        $('.accordion').append(card);
    }
}